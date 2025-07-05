(() => {
  const API_URL = `http://localhost:3000/api/v1`;

  const App = ((api_url) => {
    const htmlElements = {
      form: document.querySelector("form"),
      productId: document.querySelector("#product-id"),
    }

    const methods = {
      fetchProduct: async (id) => {
        const response = await fetch(`${api_url}/products/${id}`);
        const data = await response.json();
        return data;
      },
      fetchCategories: async () => {
        const response = await fetch(`${api_url}/categories`);
        const data = await response.json();
        return data;
      },
      renderProduct: (product) => {
        htmlElements.productId.innerHTML = `#${product.id}`;
        const form = htmlElements.form;
        const idInput = form.querySelector("input[name='id']");
        const nameInput = form.querySelector("input[name='name']");
        const priceInput = form.querySelector("input[name='price']");
        const categoryIdInput = form.querySelector("select[name='categoryId']");
        idInput.disabled = true;
        nameInput.disabled = true;
        priceInput.disabled = true;
        categoryIdInput.disabled = true;
        idInput.value = product.id;
        nameInput.value = product.name;
        priceInput.value = product.price;
        categoryIdInput.value = product.category?.id || "";
      },
      renderCategories: (categories) => {
        const categoryIdInput = htmlElements.form.querySelector("select[name='categoryId']");
        const options = categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
        categoryIdInput.innerHTML = options;
      }
    }
    return {
      init: async () => {
        const categories = await methods.fetchCategories();
        methods.renderCategories(categories.data);
        const id = window.location.search.split("=")[1];
        if (!id) return;
        const product = await methods.fetchProduct(id);
        methods.renderProduct(product);
      }
    }
  })(API_URL);
  App.init();
})();
