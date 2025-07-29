from flask import Flask, request, render_template, redirect, flash, url_for, session
import MySQLdb

app = Flask(__name__)
app.secret_key = 'miClave'

db = MySQLdb.connect(
    host="localhost",
    user="root",
    passwd="JazielSQL",
    database="first_shift"
)

cursor = db.cursor()

# Animación como pantalla principal
@app.route('/')
def index():
    return render_template('welcome.html')

# Ruta para iniciar sesión
@app.route('/login', methods=['GET', 'POST'])
def login():    
    if request.method == 'POST':
        identifier = request.form['user-identifier']
        passwd = request.form['password']

        query = "SELECT id, id_rol FROM usuarios WHERE correo = %s AND contraseña = %s"
        cursor.execute(query, (identifier, passwd))
        result = cursor.fetchone()

        if result:
            user_id, id_rol = result
            session['user_id'] = user_id
            session['id_rol'] = id_rol

            # Consultar el nombre del rol
            cursor.execute("SELECT nombre FROM roles WHERE id = %s", (id_rol,))
            rol_result = cursor.fetchone()
            rol = rol_result[0] if rol_result else None

            session['rol'] = rol # Alumno, Maestro, Administrador

            if rol == 'Alumno':
                return redirect(url_for('dashboard'))
            elif rol == 'Maestro':
                # Obtener id_maestro
                cursor.execute("SELECT id FROM maestros WHERE id_usuario = %s", (user_id,))
                maestro = cursor.fetchone()
                if maestro:
                    session['id_maestro'] = maestro[0]
                return redirect(url_for('instructor'))
            else:
                flash("Rol no reconocido")
                return redirect(url_for('login'))
        else:
            flash("Correo o contraseña incorrectos")
            return redirect(url_for('login'))
    
    return render_template('login.html')

# Ruta del formulario de registro
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        name            = request.form['nombre']
        surname         = request.form['apellido-paterno']
        second_surname  = request.form['apellido-materno']
        email           = request.form['email']
        passwd          = request.form['password']
        rol_nombre      = request.form['rol'] # Alumno o Maestro

        # Buscar ID del rol por nombre
        cursor.execute("SELECT id FROM roles WHERE LOWER(nombre) = %s", (rol_nombre.lower(),))
        rol_result = cursor.fetchone()

        if not rol_result:
            flash("Rol no válido")
            return redirect(url_for('register'))
        
        id_rol = rol_result[0]

        query_usuarios = "INSERT INTO usuarios VALUES(DEFAULT, %s, %s, %s, %s, %s, %s, DEFAULT)"
        values_usuario = (name, surname, second_surname, email, passwd, id_rol)

        try:
            cursor.execute(query_usuarios, values_usuario)
            db.commit()

            # Obtener el ID del usuario recién creado
            user_id = cursor.lastrowid

            # Insertar en la tabla correspondiente según el rol
            if rol_nombre.lower() == 'alumno':
                cursor.execute("INSERT INTO alumnos (id_usuario, matricula) VALUES(%s, %s)", (user_id, f"M{user_id:05}"))
            elif rol_nombre.lower() == 'maestro':
                cursor.execute("INSERT INTO maestros (id_usuario) VALUES(%s)", (user_id,))

            db.commit()
            flash('Usuario registrado correctamente')
            return redirect(url_for('login'))
        
        except Exception as ex:
            db.rollback()
            flash(f"Error al registrar el usuario: {str(ex)}")
            return redirect(url_for('register'))
        
    return render_template('register.html')

# Crear clase
@app.route('/crear_clase', methods=['POST'])
def crear_clase():
    nombre  = request.form['class_name']
    codigo  = request.form['class_code']
    user_id = session.get('user_id')

    # Obtener el ID del maestro desde la tabla maestros
    cursor.execute("SELECT id FROM maestros WHERE id_usuario = %s", (user_id,))
    maestro = cursor.fetchone()

    if maestro:
        id_maestro = maestro[0]
        cursor.execute("""
            INSERT INTO clases (nombre, codigo_clase, id_maestro, fecha_creacion)
            VALUES (%s, %s, %s, NOW())
        """, (nombre, codigo, id_maestro))
        db.commit()
        flash("Clase creada correctamente")
    else:
        flash("No se encontró al maestro")

    return redirect(url_for('instructor'))

# Panel principal del practicante
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']

    # Obtener ID del alumno
    cursor.execute("SELECT id FROM alumnos WHERE id_usuario = %s", (user_id,))
    alumno = cursor.fetchone()

    if not alumno:
        flash("Tu usuario no es un alumno", "error")
        return redirect(url_for('login'))

    id_alumno = alumno[0]

    # Verificar si ya está inscrito en alguna clase
    cursor.execute("""
        SELECT c.id, c.nombre, c.codigo_clase
        FROM clases c
        JOIN alumnos_clases ac ON c.id = ac.id_clase
        WHERE ac.id_alumno = %s
    """, (id_alumno,))
    clase = cursor.fetchone()

    if clase:
        id_clase, nombre_clase, codigo_clase = clase

        # Obtener prácticas asignadas a esa clase
        cursor.execute("""
            SELECT a.id, a.titulo, a.descripcion
            FROM actividades a
            JOIN actividades_clases ac ON a.id = ac.id_actividad
            WHERE ac.id_clase = %s
        """, (id_clase,))
        actividades = cursor.fetchall()

        return render_template('dashboard.html',
                               clase_unida=True,
                               nombre_clase=nombre_clase,
                               codigo_clase=codigo_clase,
                               actividades=actividades)
    
    # Si no está inscrito en ninguna clase
    return render_template('dashboard.html', clase_unida=False)

# Unirse a clase
@app.route('/unirse_clase', methods=['POST'])
def unirse_clase():
    if 'user_id' not in session:
        flash("Debes iniciar sesión", "error")
        return redirect(url_for('login'))

    user_id = session['user_id']
    codigo = request.form.get('codigo_clase')

    try:
        # Obtener ID del alumno
        cursor.execute("SELECT id FROM alumnos WHERE id_usuario = %s", (user_id,))
        alumno = cursor.fetchone()

        if not alumno:
            flash("Usuario no es alumno", "error")
            return redirect(url_for('dashboard'))

        id_alumno = alumno[0]

        # Obtener ID de la clase por código
        cursor.execute("SELECT id FROM clases WHERE codigo_clase = %s", (codigo,))
        clase = cursor.fetchone()

        if not clase:
            flash("Código de clase inválido", "error")
            return redirect(url_for('dashboard'))

        id_clase = clase[0]

        # Verificar si ya está inscrito
        cursor.execute("SELECT * FROM alumnos_clases WHERE id_alumno = %s AND id_clase = %s", (id_alumno, id_clase))
        existe = cursor.fetchone()

        if existe:
            flash("Ya estás inscrito en esta clase", "info")
        else:
            cursor.execute("INSERT INTO alumnos_clases (id_alumno, id_clase) VALUES (%s, %s)", (id_alumno, id_clase))
            db.commit()
            flash("Te has unido a la clase correctamente", "success")

    except Exception as e:
        db.rollback()
        flash("Error al unirse a la clase: " + str(e), "error")

    return redirect(url_for('dashboard'))




# Panel principal del instructor
@app.route('/instructor')
def instructor():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session.get('user_id')

    # Obtener el ID del maestro 
    cursor.execute("SELECT id FROM maestros WHERE id_usuario = %s", (user_id,))
    maestro = cursor.fetchone()

    if maestro:
        id_maestro = maestro[0]

        # Verificar si ya tiene clase
        cursor.execute("SELECT id, nombre, codigo_clase FROM clases WHERE id_maestro = %s", (id_maestro,))
        clase = cursor.fetchone()

        if clase:
            id_clase, nombre_clase, codigo_clase = clase

            # Obtener actividades asignadas a esa clase
            cursor.execute("""
                SELECT a.id, a.titulo, a.descripcion
                FROM actividades a
                JOIN actividades_clases ac ON a.id = ac.id_actividad
                WHERE ac.id_clase = %s
            """, (id_clase,))
            actividades = cursor.fetchall()

            return render_template('instructor.html',
                                   clase_creada=True,
                                   nombre_clase=nombre_clase,
                                   codigo_clase=codigo_clase,
                                   actividades=actividades)

    return render_template('instructor.html', clase_creada=False)

# Panel creación de práctica
@app.route('/upload')
def upload():
    if 'id_maestro' not in session:
        flash("Sesión expirada. Inicia sesión de nuevo.", "error")
        return redirect(url_for('login'))
    
    id_maestro = session['id_maestro']

    # Obtener clases del maestro
    cursor.execute("SELECT id, nombre FROM clases WHERE id_maestro = %s", (id_maestro,))
    clases = cursor.fetchall()

    return render_template('upload.html', clases=clases)

# Interfaz creación de práctica
@app.route('/crear_practica', methods=['POST'])
def crear_practica():
    if 'id_maestro' not in session:
        flash("Sesión expirada. Por favor, vuelve a iniciar sesión.", "error")
        return redirect(url_for('login'))

    # Obtener datos del formulario
    titulo = request.form.get('titulo')
    descripcion = request.form.get('descripcion')
    id_clase = request.form.get('id_clase')
    fecha_entrega = request.form.get('fecha_entrega')
    id_maestro = session['id_maestro']

    # Validar campos
    if not titulo or not descripcion or not id_clase or not fecha_entrega:
        flash("Por favor, completa todos los campos.", "error")
        return redirect(url_for('upload'))

    try:
        # Insertar en tabla actividades
        query_actividad = """
            INSERT INTO actividades (titulo, descripcion, id_maestro, fecha_entrega)
            VALUES (%s, %s, %s, %s)
        """
        values_actividad = (titulo, descripcion, id_maestro, fecha_entrega)
        cursor.execute(query_actividad, values_actividad)
        db.commit()

        id_actividad = cursor.lastrowid

        # Insertar en tabla actividades_clases
        query_relacion = """
            INSERT INTO actividades_clases (id_actividad, id_clase)
            VALUES (%s, %s)
        """
        cursor.execute(query_relacion, (id_actividad, id_clase))
        db.commit()

        flash("Práctica creada correctamente.", "success")
        return redirect(url_for('instructor'))

    except Exception as e:
        db.rollback()
        print("Error al crear la práctica:", e)
        flash("Error al crear la práctica. Intenta nuevamente.", "error")
        return redirect(url_for('upload'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)