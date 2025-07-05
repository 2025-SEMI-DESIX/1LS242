(() => {
  const API_URL = `http://localhost:3000/api/v1`;

  const App = ((api_url) => {
    const htmlElements = {
      table: document.querySelector(".products-table"),
    }

    const handlers = {
      deleteProduct: async (id) => {
        const response = await fetch(`${api_url}/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const { data, count } = await methods.fetchProducts();
          methods.renderProducts({ data, count });
        }
      },
    };

    const methods = {
      fetchProducts: async () => {
        const response = await fetch(`${api_url}/products`);
        const data = await response.json();
        return data;
      },
      renderProducts: ({ data, count }) => {
        htmlElements.table.innerHTML = data.map((product) => `
            <tr data-id="${product.id}">
                <td>${product.id}</td>
                <td>${product.category?.name || "Sin categoría"}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                    <button class="delete-button">Eliminar</button>
                </td>
            </tr>
        `).join("");
        htmlElements.table.querySelectorAll(".delete-button").forEach((button) => {
          button.addEventListener("click", (e) => {
            const tr = e.target.closest("tr");
            const id = tr.dataset.id;
            tr.remove();
            handlers.deleteProduct(id);
          });
        });
        htmlElements.table.querySelectorAll("tr").forEach((tr) => {
          tr.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-button")) return;
            const id = tr.dataset.id;
            window.location.href = `./product.html?id=${id}`;
          });
        });
      }
    }

    return {
      init: async () => {
        const { data, count } = await methods.fetchProducts();
        methods.renderProducts({ data, count });
      }
    }
  })(API_URL);
  App.init();
})();
