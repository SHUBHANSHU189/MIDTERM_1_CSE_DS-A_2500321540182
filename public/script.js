const API = "/api/products";

const form = document.getElementById("productForm");

const productList = document.getElementById("productList");

let editMode = false;


// GET - Fetch all products
async function fetchProducts() {

    const response = await fetch(API);

    const products = await response.json();

    productList.innerHTML = "";

    products.forEach(product => {

        const row = document.createElement("tr");

        [product.id, product.name, product.price, product.category]
            .forEach(value => {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });

        const actions = document.createElement("td");

        // Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";

        editBtn.className = "edit";

        editBtn.onclick = () => editProduct(product);

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.className = "delete";

        deleteBtn.onclick = () => deleteProduct(product.id);

        actions.appendChild(editBtn);

        actions.appendChild(deleteBtn);

        row.appendChild(actions);

        productList.appendChild(row);

    });

}


// POST and PUT - Add or Update product
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const product = {

        id: Number(document.getElementById("id").value),

        name: document.getElementById("name").value,

        price: Number(document.getElementById("price").value),

        category: document.getElementById("category").value

    };

    const url = editMode
        ? `${API}/${product.id}`
        : API;

    const method = editMode ? "PUT" : "POST";

    const response = await fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    });

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    alert(result.message);

    form.reset();

    document.getElementById("id").disabled = false;

    document.getElementById("submitBtn").textContent = "Add Product";

    editMode = false;

    fetchProducts();

});


// Edit product
function editProduct(product) {

    document.getElementById("id").value = product.id;

    document.getElementById("name").value = product.name;

    document.getElementById("price").value = product.price;

    document.getElementById("category").value = product.category;

    document.getElementById("id").disabled = true;

    editMode = true;

    document.getElementById("submitBtn").textContent = "Update Product";

}


// DELETE - Delete product
async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {

        return;

    }

    const response = await fetch(`${API}/${id}`, {

        method: "DELETE"

    });

    const result = await response.json();

    alert(result.message);

    fetchProducts();

}


// Load products when page opens
fetchProducts();