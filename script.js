function initCRUD(entity, loadTable = true, relations = []) {
    const API = `http://localhost:3000/${entity}`;

    // Mapa para inputs y botones correctos
    const nameMap = {
        countries: "country",
        regions: "region",
        cities: "city",
        companies: "company",
        branches: "branch"
    };

    const singular = nameMap[entity]; // ej: "country"

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
                    <input type="text" value="${c.name || c.nombre}" id="edit-${entity}-${c.id}">
                </td>
                <td class="actions">
                    <button onclick="updateData('${entity}', '${c.id}')">✏ Editar</button>
                    <button onclick="deleteData('${entity}', '${c.id}')">🗑 Eliminar</button>
                </td>
            </tr>
            `;
        });
    }

    // Crear
    async function createData() {
        const input = document.getElementById(`${singular}Name`);
        if (!input) return;
        const name = input.value.trim();
        if (!name) return alert("Escribe un nombre");

    let newData = { name };

    // Mapear correctamente relaciones
    const relationMap = {
        countries: "countryId",
        regions: "countryId",
        cities: "regionId",
        companies: "cityId",
        branches: "companyId"
    };

    if (relations && relations.length > 0) {
        relations.forEach(rel => {
            const select = document.getElementById(`${entity}-${rel}-select`);
            if (select) {
                const key = relationMap[entity];
                newData[key] = parseInt(select.value);
            }
        });
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

        await fetch(`http://localhost:3000/${ent}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        });
        loadData();
    };

    // Eliminar
    window.deleteData = async function(ent, id) {
    console.log("Eliminando", ent, "con id", id);
    if (confirm("¿Seguro que deseas eliminar?")) {
        await fetch(`http://localhost:3000/${ent}/${id}`, { method: "DELETE" });
        loadData();
    }
};


    // Buscar
    async function searchData() {
        const input = document.getElementById(`search${singular.charAt(0).toUpperCase() + singular.slice(1)}`);
        if (!input) return;
        const q = input.value;
        if (!q) return alert("Escribe algo para buscar");
        const res = await fetch(`${API}?q=${q}`);
        const data = await res.json();
        const result = document.getElementById(`search${singular.charAt(0).toUpperCase() + singular.slice(1)}Result`);
        result.innerHTML = data.length
            ? data.map(c => `<p>Encontrado: ${c.name} (id ${c.id})</p>`).join("")
            : "<p>No encontrado</p>";
    }

    // Eventos
    const addBtn = document.getElementById(`add${singular.charAt(0).toUpperCase() + singular.slice(1)}`);
    const searchBtn = document.getElementById(`search${singular.charAt(0).toUpperCase() + singular.slice(1)}Btn`);

    if (addBtn) addBtn.addEventListener("click", createData);
    if (searchBtn) searchBtn.addEventListener("click", searchData);

    // Inicial
    loadData();
}
