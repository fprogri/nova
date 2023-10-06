describe("template spec", () => {
  it("passes", () => {
    cy.request(
      "POST",
      "https://jysk.al/public/clickkon/product/list?includeWebCats=true",
      {
        return_excel_translations: false,
        filters_join_operator_kind: 1,
        filters: [],
        select_fields: [
          { name: "clickkon_product_id", alias: "clickkon_product_id" },
          { name: "name", alias: "name" },
          { name: "ind_camp_description", alias: "ind_camp_description" },
          { name: "ind_camp_exists", alias: "ind_camp_exists" },
          { name: "ind_camp_price_w_wat", alias: "ind_camp_price_w_wat" },
          { name: "price_w_vat", alias: "price_w_vat" },
          { name: "fin_price_w_vat", alias: "fin_price_w_vat" },
        ],
        order_fields: [{ name: "name", mode: 1 }],
        aggregate_fields: [],
        skip: -1,
        take: -1,
        return_tree: true,
        return_excel: false,
        where: {
          query: "",
          values: [true, "edlp"],
        },
        tree_max_depth: null,
      }
    ).then((response) => {
      expect(response.status).to.equal(200); // Assuming you want to check the response status
      const products = response.body; // Store the response data in a variable
      cy.writeFile(
        "products.js",
        `const products = ${JSON.stringify(products)}
        export default products`
      );
    });
  });
});
