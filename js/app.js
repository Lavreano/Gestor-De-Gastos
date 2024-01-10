Vue.component('formulario-gasto', {
    data() {
        return {
            nuevoGasto: {
                nombre: '',
                cantidad: 0,
                precio: 0,
                categoria: 'Alimentación'
            },
            errores: {
                nombre: '',
                cantidad: '',
                precio: ''
            }
        };
    },
    methods: {
        agregarGasto() {
            this.errores = {};

            if (!this.nuevoGasto.nombre) {
                this.errores.nombre = 'Por favor ingresa el nombre del producto';
            }
            if (this.nuevoGasto.cantidad <= 0) {
                this.errores.cantidad = 'La cantidad debe ser mayor que cero';
            }
            if (this.nuevoGasto.precio <= 0) {
                this.errores.precio = 'El precio debe ser mayor que cero';
            }

            if (Object.keys(this.errores).length === 0) {
                this.$emit('agregar', { ...this.nuevoGasto });
                this.nuevoGasto.nombre = '';
                this.nuevoGasto.cantidad = 0;
                this.nuevoGasto.precio = 0;
                this.nuevoGasto.categoria = 'Alimentación';
            }
        }
    },
    template: `
        <div class="body-container">
            <h2>Registrar un Nuevo Gasto</h2>
            <form class="form-container" @submit.prevent="agregarGasto">
                <label for="nombreGasto">Producto / Servicio:</label>
                <input type="text" id="nombreGasto" v-model="nuevoGasto.nombre" required>
                <p class="error">{{ errores.nombre }}</p>

                <label for="cantidadGasto">Cantidad:</label>
                <input type="number" id="cantidadGasto" v-model="nuevoGasto.cantidad" required>
                <p class="error">{{ errores.cantidad }}</p>

                <label for="precioGasto">Precio (por unidad):</label>
                <input type="number" id="precioGasto" v-model="nuevoGasto.precio" required>
                <p class="error">{{ errores.precio }}</p>

                <label class="select" for="categoriaGasto">Categoría:</label>
                <select id="categoriaGasto" v-model="nuevoGasto.categoria">
                    <option value="Alimentación">Alimentación</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Salud">Salud</option>
                    <option value="Otros">Otros</option>
                </select>
                <button type="submit">Agregar Gasto</button>
            </form>
        </div>
    `
});

// Componente para la lista de gastos
Vue.component('lista-gastos', {
    props: ['gastos'],
    template: `
    <div class="container mt-4">
    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="pt-3 pb-4 text-center font-bold">Control de gastos</h2>
                    <div class="input-group md-form form-sm form-2 pl-0">
                        <input class="form-control my-0 py-1 pl-3 purple-border" type="text" placeholder="Busca tu historial" aria-label="Search">
                        <span class="icono-background"><a><i class="fa fa-search icono-search" aria-hidden="true"></i></a></span>
                    </div>
                </div>
            </div>
            <table class="table table-striped">

                <thead>
                    <tr>
                        <th><i class="fa-solid fa-filter"></i>Categoria</th>
                        <th><i class="fa-solid fa-bell-concierge"></i> Producto / Servicio</th>
                        <th><i class="fa-solid fa-arrow-up-wide-short"></i> Cantidad</th>
                        <th><i class="fa-solid fa-hand-holding-dollar"></i> Precio Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(gasto, index) in gastos" :key="index">
                        <td>{{ gasto.categoria }}</td>
                        <td>{{ gasto.nombre }}</td>
                        <td>{{ gasto.cantidad }}</td>
                        <td>$ {{ gasto.cantidad * gasto.precio }}</td>
                    </tr>
                </tbody>

            </table> 
            <div class="container-total">
            <p v-if="gastos.length === 0">No hay gastos registrados.</p>
            <p v-else-if="gastos.length === 1">Hay un gasto registrado.</p>
            <p v-else>Hay {{ gastos.length }} gastos registrados.</p>
            <p>Total de Dinero Gastado: $ {{ calcularTotalGastos() }}</p>
        </div>
        </div>
    </div>
</div>
    `,
    methods: {
        calcularTotalGastos() {
            return this.gastos.reduce((total, gasto) => total + (gasto.cantidad * gasto.precio), 0);
        }
    }
});

new Vue({
    el: '#app',
    data: {
        gastos: [],
        totalDineroGastado: 0,
    },
    methods: {
        agregarGasto(nuevoGasto) {
            this.gastos.push(nuevoGasto);
            localStorage.setItem('gastos', JSON.stringify(this.gastos));
        }
    },
    computed: {
        calcularTotalGastos() {
            return this.gastos.reduce((total, gasto) => total + (gasto.cantidad * gasto.precio), 0);
        }
    },
    created() {
        // Cargar los gastos desde localStorage al inicio
        const gastosGuardados = localStorage.getItem('gastos');
        if (gastosGuardados) {
            this.gastos = JSON.parse(gastosGuardados);
        }
    }
});

console.log(localStorage.getItem('gastos'));



