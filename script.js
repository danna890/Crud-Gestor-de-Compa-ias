function initCRUD(entity, loadTable = true, relations = []) {
    const API = `http://localhost:3000/${entity}`;

    // 🔹 Cargar opciones para selects
    async function loadRelations() {
        for (let rel of relations) {
            const res = await fetch(`http://localhost:3000/${rel}`);
            const data = await res.json();
            const select = document.getElementById(`${entity}-${rel}-select`);
            if (select) {
                select.innerHTML = data.map(r => `<option value="${r.id}">${r.name || r.nombre}</option>`).join("");
            }
        }
    }

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
                ${relations.map(rel => `
                    <td>
                        <select id="edit-${entity}-${rel}-${c.id}"></select>
                    </td>
                `).join("")}
                <td class="actions">
                    <button onclick="updateData('${entity}', ${c.id})">✏ Editar</button>
                    <button onclick="deleteData('${entity}', ${c.id})">🗑 Eliminar</button>
                </td>
            </tr>
            `;
        });

        // 🔹 cargar selects de cada fila
        for (let rel of relations) {
            const res = await fetch(`http://localhost:3000/${rel}`);
            const relData = await res.json();
            data.forEach(c => {
                const select = document.getElementById(`edit-${entity}-${rel}-${c.id}`);
                if (select) {
                    select.innerHTML = relData.map(r =>
                        `<option value="${r.id}" ${c[`${rel.slice(0, -1)}Id`] == r.id ? "selected" : ""}>
                            ${r.name || r.nombre}
                        </option>`).join("");
                }
            });
        }
    }

    // Crear
    async function createData() {
        const input = document.getElementById(`${entity.slice(0,-1)}Name`);
        if (!input) return;
        const name = input.value;
        if (!name) return alert("Escribe un nombre");

        let newData = { name };

        // añadir relaciones seleccionadas
        for (let rel of relations) {
            const select = document.getElementById(`${entity}-${rel}-select`);
            if (select) newData[`${rel.slice(0, -1)}Id`] = parseInt(select.value);
        }

        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData)
        });
        input.value = "";
        loadData();
    }

    // Actualizar
    window.updateData = async function(ent, id) {
        const name = document.getElementById(`edit-${ent}-${id}`).value;
        let updated = { name };

        // relaciones
        for (let rel of relations) {
            const select = document.getElementById(`edit-${ent}-${rel}-${id}`);
            if (select) updated[`${rel.slice(0, -1)}Id`] = parseInt(select.value);
        }

        await fetch(`http://localhost:3000/${ent}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
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
    loadRelations();
}
