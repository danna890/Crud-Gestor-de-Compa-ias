function initCRUD(entity, loadTable = true) {
    const API = `http://localhost:3000/${entity}`;

    // Listar
    async function loadData() {
        if (!loadTable) return;
        const res = await fetch(API);
        const data = await res.json();
        const table = document.getElementById(`${entity}Table`);
        if (!table) return;
        table.innerHTML = "";

        data.forEach(c => {
        table.innerHTML += `
            <tr>
            <td>${c.id}</td>
            <td>
                <input type="text" value="${c.name || c.nombre || c.companyName || c.branchName}" id="edit-${entity}-${c.id}">
            </td>
            <td class="actions">
                <button onclick="updateData('${entity}', ${c.id})">✏ Editar</button>
                <button onclick="deleteData('${entity}', ${c.id})">🗑 Eliminar</button>
            </td>
            </tr>
        `;
        });
    }

    // Crear
    async function createData() {
        const input = document.getElementById(`${entity.slice(0,-1)}Name`);
        if (!input) return;
        const name = input.value;
        if (!name) return alert("Escribe un nombre");
        await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
        });
        input.value = "";
        loadData();
    }

    // Actualizar
    window.updateData = async function(ent, id) {
        const name = document.getElementById(`edit-${ent}-${id}`).value;
        await fetch(`http://localhost:3000/${ent}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
        });
        loadData();
    };

    // Eliminar
    window.deleteData = async function(ent, id) {
        if (confirm("¿Seguro que deseas eliminar?")) {
        await fetch(`http://localhost:3000/${ent}/${id}`, { method: "DELETE" });
        loadData();
        }
    };

    // Buscar
    async function searchData() {
        const input = document.getElementById(`search${entity.slice(0,-1).charAt(0).toUpperCase() + entity.slice(0,-1).slice(1)}`);
        if (!input) return;
        const q = input.value;
        if (!q) return alert("Escribe algo para buscar");
        const res = await fetch(`${API}?q=${q}`);
        const data = await res.json();
        const result = document.getElementById(`search${entity.slice(0,-1).charAt(0).toUpperCase() + entity.slice(0,-1).slice(1)}Result`);
        result.innerHTML = data.length
        ? data.map(c => `<p>Encontrado: ${c.name} (id ${c.id})</p>`).join("")
        : "<p>No encontrado</p>";
    }

    // Eventos
    const addBtn = document.getElementById(`add${entity.slice(0,-1).charAt(0).toUpperCase() + entity.slice(0,-1).slice(1)}`);
    const searchBtn = document.getElementById(`search${entity.slice(0,-1).charAt(0).toUpperCase() + entity.slice(0,-1).slice(1)}Btn`);

    if (addBtn) addBtn.addEventListener("click", createData);
    if (searchBtn) searchBtn.addEventListener("click", searchData);

    // Inicial
    loadData();
}
