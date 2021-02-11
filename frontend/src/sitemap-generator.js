const Axios = require("axios");
require("babel-register")({
  presets: ["es2015", "react"]
});


const router = require("./routes/sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

async function generateSitemap() {
  try {
    const products = await Axios.get("https://grandmobile.gr/api/products");
    let idProducts = [];
    let idCollection = [];
    let categoriesRoute = [];

    for (let i = 0; i < products.data.length; i++) {
      if(products.data[i].category==="Συλλογή"){
        idCollection.push({ id: products.data[i]._id });
      }
      else
      {
        idProducts.push({ id: products.data[i]._id });
      }
    }

    const categories = await Axios.post("https://grandmobile.gr/api/admin/categories");

    for (let i = 0; i < categories.data.length; i++) {
      let parentId=categories.data[i].category_id;
      let subcategories = await Axios.post("https://grandmobile.gr/api/admin/subcategories", {parentId});
      
      for(let j=0; j < subcategories.data.length; j++)
      {
        categoriesRoute.push({category: categories.data[i].category.toString(), subcategory: subcategories.data[j].category.toString()})
        // console.log(subcategories.data[j])
      }
      // console.log(subcategories)
    }

    const paramsConfig = {
      "/product/:id": idProducts,
      "/products/:category/:subcategory": categoriesRoute,
      "/collection/:id": idCollection
      
    };

    return (
      new Sitemap(router)
        .applyParams(paramsConfig)
        .build("https://www.grandmobile.gr")
        .save("./public/sitemap.xml")
    );
  } catch (e) {
    console.log(e);
  }
  
}

generateSitemap();