const baseUrl = "https://novahome.al/products.json?limit=250&page=";
let currentPage = 1;
const products = [];

function fetchProducts() {
  const url = baseUrl + currentPage;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const productsArray = data.products;

      if (Array.isArray(productsArray) && productsArray.length > 0) {
        // Push the products from this page into the allProducts array
        products.push(...productsArray);

        // Increment the page number and fetch the next page
        currentPage++;
        fetchProducts();
      } else {
        console.log("All products have been fetched.");
        console.log("Total products:", products.length);
        console.log("All products:", products);

        const minPriceInput = document.getElementById("min-price");
        const maxPriceInput = document.getElementById("max-price");
        const applyPriceFilterButton =
          document.getElementById("apply-price-filter");
        const minDiscInput = document.getElementById("min-disc");
        const maxDiscInput = document.getElementById("max-disc");
        const applyDiscFilterButton =
          document.getElementById("apply-disc-filter");
        const sortByPriceSelect = document.getElementById("sort-by-price");
        const sortByDiscSelect = document.getElementById("sort-by-disc");
        const goldCategoryCheckbox = document.getElementById(
          "gold-category-filter"
        );
        let products2 = products;
        // Function to display products
        function displayProducts(products) {
          const productList = document.querySelector(".product-list");
          productList.innerHTML = `<p>Product count: ${products2.length}</p>`;

          products.forEach((product) => {
            const link = "https://novahome.al/products/" + product.handle;

            // Check if the product has images before accessing the 'src' property
            if (product.images && product.images.length > 0) {
              const src = product.images[0].src;

              const discount = parseInt(
                ((product.variants[0].compare_at_price -
                  product.variants[0].price) /
                  product.variants[0].compare_at_price) *
                  100
              );

              // Create a product card element for each product
              const productCard = document.createElement("div");
              productCard.classList.add("product-card");

              // Customize the content of the product card using the product object properties
              productCard.innerHTML = `
                <img src=${src} loading="lazy">
                <a href=${link} target="_blank" class="path">${product.title}</a>
                <p>Ishte: ${product.variants[0].compare_at_price} Lek</p>
                <p class="after-price">${product.variants[0].price} Lek</p>
                <p>${discount}%</p>
                <p>${product.product_type}</p>
                <p class="path">${product.variants[0].available}
                <!-- Add more product details as needed -->
              `;

              // Append the product card to the product list container
              productList.appendChild(productCard);
            }
          });
        }
        function filterByPriceRange(minPrice, maxPrice) {
          products2 = products2.filter((product) => {
            const productPrice = product.variants[0].price;
            return productPrice >= minPrice && productPrice <= maxPrice;
          });

          // Display the filtered products
          displayProducts(products2);
        }
        function filterByDiscRange(minDisc, maxDisc) {
          products2 = products2.filter((product) => {
            const productDisc = parseInt(
              ((product.variants[0].compare_at_price -
                product.variants[0].price) /
                product.variants[0].compare_at_price) *
                100
            );
            return productDisc >= minDisc && productDisc <= maxDisc;
          });

          // Display the filtered products
          displayProducts(products2);
        }
        function sortByPriceAscending() {
          products2 = [...products2];
          products2.sort((a, b) => a.variants[0].price - b.variants[0].price);

          // Display the sorted products
          displayProducts(products2);
        }
        function sortByPriceDescending() {
          products2 = [...products2];
          products2.sort((a, b) => b.variants[0].price - a.variants[0].price);

          // Display the sorted products
          displayProducts(products2);
        }
        function sortByDiscAscending() {
          products2 = [...products2];
          products2.sort(
            (a, b) =>
              (a.variants[0].compare_at_price - a.variants[0].price) /
                a.variants[0].compare_at_price -
              (b.variants[0].compare_at_price - b.variants[0].price) /
                b.variants[0].compare_at_price
          );

          // Display the sorted products
          displayProducts(products2);
        }
        function sortByDiscDescending() {
          products2 = [...products2];
          products2.sort(
            (a, b) =>
              (b.variants[0].compare_at_price - b.variants[0].price) /
                b.variants[0].compare_at_price -
              (a.variants[0].compare_at_price - a.variants[0].price) /
                a.variants[0].compare_at_price
          );

          // Display the sorted products
          displayProducts(products2);
        }
        function filterByGoldCategory(showGoldCategory) {
          if (showGoldCategory) {
            products2 = products2.filter(
              (product) => product.gen_cat.n === "GOLD"
            );
            // Display only products in the "GOLD" category
            displayProducts(products2);
          } else {
            // Display all products when the checkbox is unchecked
            displayProducts(products2);
          }
        }
        displayProducts(products);

        applyPriceFilterButton.addEventListener("click", () => {
          const minPrice = parseFloat(minPriceInput.value) || 0;
          const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

          // Filter products by the specified price range
          filterByPriceRange(minPrice, maxPrice);
        });
        applyDiscFilterButton.addEventListener("click", () => {
          const minDisc = parseFloat(minDiscInput.value) || 0;
          const maxDisc = parseFloat(maxDiscInput.value) || Infinity;

          // Filter products by the specified price range
          filterByDiscRange(minDisc, maxDisc);
        });
        sortByPriceSelect.addEventListener("change", () => {
          const selectedOption = sortByPriceSelect.value;

          if (selectedOption === "low-to-high") {
            // Sort products by price in ascending order (lowest to highest)
            sortByPriceAscending();
          } else if (selectedOption === "high-to-low") {
            // Sort products by price in descending order (highest to lowest)
            sortByPriceDescending();
          }
        });
        sortByDiscSelect.addEventListener("change", () => {
          const selectedOption = sortByDiscSelect.value;

          if (selectedOption === "low-to-high") {
            // Sort products by price in ascending order (lowest to highest)
            sortByDiscAscending();
          } else if (selectedOption === "high-to-low") {
            // Sort products by price in descending order (highest to lowest)
            sortByDiscDescending();
          }
        });
        goldCategoryCheckbox.addEventListener("change", () => {
          const showGoldCategory = goldCategoryCheckbox.checked;

          // Filter products by the "GOLD" category
          filterByGoldCategory(showGoldCategory);
        });

        ///////////////////////////////////////////////////////////////////////////

        const productSearchInput = document.getElementById("product-search");
        const searchButton = document.getElementById("search-button");

        // Add an event listener to the search button
        searchButton.addEventListener("click", () => {
          const searchTerm = productSearchInput.value.trim().toLowerCase();
          console.log(searchTerm);

          // Perform the product search
          performProductSearch(searchTerm);
        });

        // Add an event listener to the search input field to trigger the search on "Enter" key press
        productSearchInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            const searchTerm = productSearchInput.value.trim().toLowerCase();

            // Perform the product search
            performProductSearch(searchTerm);
          }
        });

        // Function to perform the product search
        function performProductSearch(searchTerm) {
          console.log("in function");
          products2 = products2.filter(
            (product) =>
              Object.values(product).some(
                (value) =>
                  value !== null &&
                  typeof value === "string" &&
                  value.toLowerCase().includes(searchTerm)
              )

            // const productName = product.name.toLowerCase();
            // let productDescription = "";
            // if (product.ind_camp_description == true) {
            //   productDescription = product.ind_camp_description.toLowerCase();
            // }
            // return (
            //   productName.includes(searchTerm) ||
            //   productDescription.includes(searchTerm)
            // );
          );

          // Display the search results
          displayProducts(products2);
          console.log(products2);
        }
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Start fetching products from the first page
fetchProducts();
