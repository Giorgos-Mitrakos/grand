import React, {useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './AdminProductsScreen.css';
import { saveProduct, listManufacturers, listFeatureTitles, getFeatureNames, insertFeature, 
    listFeatures, deleteFeature,listCategories, listSubcategories, changeVisibility, 
    getProductsByCategoryAdmin, changeCategoryPercentage, listCompatibilityCompanies, 
    getCompatibilityModels,insertCompatibility, getProductCompatibilities, deleteProductCompatibility } from '../action/productActions';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminProductsScreen(props) {

    const [modalVisible,setModalVisible] = useState(false);
    const [percentageModal,setPercentageModal] = useState(false);
    const [featureTitle,setFeatureTitle] = useState('');
    const [featureName,setFeatureName] = useState('');
    const [id,setId] = useState('');
    const [name,setName] = useState('');
    const [category,setCategory] = useState(' ');
    const [brand,setBrand] = useState(' ');
    const [subcategory,setSubcategory] = useState('');
    const [image,setImage] = useState('');
    const [price,setPrice] = useState('');
    const [pricePercentage,setPricePercentage] = useState('');
    const [description,setDescription] = useState('');
    const [compatibilityCompany,setCompatibilityCompany] = useState('');
    const [compatibilityCompanyId,setCompatibilityCompanyId] = useState('');
    const [compatibilityModel,setCompatibilityModel] = useState('');
    const productList= useSelector(state=>state.productList);
    const {products,loading,error,loadingSave:successSave,errorSave, successPercentageChange}=productList;
    const categoryList = useSelector(state=>state.categoryList);
    const {categories, loading:categoriesLoading, error:categoriesError} = categoryList;
    const subcategoryList = useSelector(state=>state.subcategoryList);
    const {subcategories, loading:subcategoriesLoading, error:subcategoriesError} = subcategoryList;    
    const manufacturersList = useSelector(state=>state.manufacturersList);
    const {manufacturers, loading:loadingManufacturer, error:errorManufacturer} = manufacturersList;
    const featureNameList = useSelector(state=>state.featureNameList);
    const {featureNames, loading:featureNamesLoading, error:featureNamesError} = featureNameList;
    const featureTitleList = useSelector(state=>state.featureTitleList);
    const {featureTitles, loading:featureTitleLoading, error:featureTitleError} = featureTitleList;
    const featureList = useSelector(state=>state.featureList);
    const {features, loading:featureListLoading, error:featureListError} = featureList;
    const compatibilityCompanies = useSelector(state=>state.compatibilityCompanies);
    const {companies,loading: loadingcompatibilityCompanies,error: errorcompatibilityCompanies} = compatibilityCompanies;
    const compatibilityModels = useSelector(state=>state.compatibilityModels);
    const {models,loading: loadingCompatibilityModels,error: errorCompatibilityModels} = compatibilityModels;
    const productCompatibilities = useSelector(state=>state.productCompatibilities);
    const {productCompat,loading: loadingProductCompatibilities,error: errorProductCompatibilities} = productCompatibilities;
    
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(listCategories());
        
        return ()=>{

        }
    },[]);

    useEffect(()=>{
        if(successSave)
        {
            setModalVisible(false);
            dispatch(getProductsByCategoryAdmin(category,subcategory));
        }
        return ()=>{

        }
    },[successSave]);

    useEffect(()=>{
        if(successPercentageChange===true)
        {
        setPercentageModal(false);
        dispatch(getProductsByCategoryAdmin(category,subcategory));
        }
        return ()=>{

        }
    },[successPercentageChange]);

    useEffect(()=>{
        if(category && category!=='')
        {
        let sub = {};
        sub= categories.filter(cat=>cat.category===category)
        if(sub[0])
        dispatch(listSubcategories(sub[0].category_id));
        }
        return ()=>{

        }
    },[category]);

    const openModal = (product) =>{
        setModalVisible(true);        
        setId(product._id);        
        setName(product.name);
        setCategory(product.category);
        setBrand(product.brand);
        setSubcategory(product.subcategory);
        setImage(product.image);
        setPrice(product.price);
        setPricePercentage(product.percentage);
        setDescription(product.description);
        dispatch(listFeatures(product._id));
        dispatch(getProductCompatibilities(product._id));
        dispatch(listManufacturers());
        dispatch(listFeatureTitles());
        dispatch(listCompatibilityCompanies());
    }
    
    const submitHandler = (e) => {
        const product = new FormData();
        product.append('_id',id);
        product.append('name',name);
        product.append('category',category);
        product.append('brand',brand);
        product.append('subcategory',subcategory);
        product.append('image',image);
        product.append('price',price);
        product.append('percentage',pricePercentage);
        product.append('description',description);
        e.preventDefault();
        dispatch(saveProduct(id,product));
    }

    const featureTitleHandler = (e) =>{
        setFeatureTitle(e.target.value);
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let option =  el.getAttribute('id');
        dispatch(getFeatureNames(option));
    }

    const categoryHandler = (e) =>{
        setCategory(e.target.value);
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let option =  el.getAttribute('id');
        dispatch(listSubcategories(option));
    }
    
    const deleteFeatureHandler = (featureId) =>{
        dispatch(deleteFeature(id,featureId));
    }

    const addFeature = () =>{
        dispatch(insertFeature(id,featureTitle,featureName));
    }

    const visibilityChangeHandler = (product) =>{
        dispatch(changeVisibility(product._id, !product.visibility));
    }

    const searchHandler = ()=>{
        dispatch(getProductsByCategoryAdmin(category,subcategory));
    }

    const categoryPercentageHandler = () =>{
        dispatch(changeCategoryPercentage(pricePercentage, category,subcategory))
    }

    const compatibilityCompaniesChangeHandler = (e)=>{
        setCompatibilityCompany(e.target.value);
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let option =  el.getAttribute('id');
        dispatch(getCompatibilityModels(option));
        setCompatibilityCompanyId(option);
    }

    const addCompatibility = () =>{
        dispatch(insertCompatibility(id,compatibilityCompany,compatibilityModel));
    }

    const deleteCompatibilityHandler = (compatibilityId)=>{
        dispatch(deleteProductCompatibility(compatibilityId));
    }

    return <div className="content content-margined">
    <div className="product-header">
        <h3>Προϊόντα</h3>
        <button className="button admin-button" onClick={()=>setPercentageModal(true)}>Ποσοστό Κέρδους</button>
        <div id="changeStatusModal" className="modal" style={{display: percentageModal? "block": "none"}}>
            <div className="modal-content">
                <div className="modalHeader">
                    <h2>Επεξεργασία Ποσοστού Κέρδους Ανά Κατηγορία</h2>
                </div>
                <ul className="percentage-container">
                    <li>
                        <label htmlFor="product-category">Κατηγορία:</label>
                        {categoriesLoading?<div>Loading...</div>
                        :categoriesError?<div>{categoriesError}</div>
                        :
                        <select name="product-category" onChange={(e)=> categoryHandler(e)}>
                            <option>Επέλεξε Κατηγορία</option>
                            {categories.filter(cat=>cat.parent_id===null).map(cat=>
                                <option id={cat.category_id} value={cat.category} selected={cat.category===category}>{cat.category}</option>)}
                        </select>}
                    </li>
                    <li>
                        <label htmlFor="product-subcategory">Υποκατηγορία:</label>
                        {subcategoriesLoading?<div>Loading...</div>:
                        subcategoriesError?<div>{subcategoriesError}</div>:
                        <select className="product-subcategory" disabled={category==="Επέλεξε Κατηγορία"} onChange={(e)=>setSubcategory(e.target.value)}>
                        <option>Επέλεξε Υποκατηγορία</option>
                        {subcategories.map(sub=>
                            <option id={sub.category_id} value={sub.category} selected={sub.category===subcategory}>{sub.category}</option>)}
                        </select>}
                    </li>
                    <li> 
                        <label htmlFor="percentage-input">Ποσοστό:</label>                       
                        <input name="percentage-input" id="percentage-input" typeof="text" maxLength="5" style={{width:"4rem"}} onChange={(e)=>setPricePercentage(e.target.value)}/>
                        <label>%</label>
                    </li>
                </ul>
                <div className="okCancelButton-wrapper">
                    <button className="okCancelButton button" onClick={categoryPercentageHandler}>OK</button>
                    <button className="okCancelButton button" onClick={()=>setPercentageModal(false)} >Ακύρωση</button>
                </div>
            </div>
        </div>
        <button className="button admin-button" onClick={()=>openModal({})}>Δημιουργία Προϊόντος</button>
    </div>
   {modalVisible &&
    <div>
        <div className="modal" style={{display: modalVisible? "block": "none",overflowY:"scroll",maxHeight:"40rem"}}>
            <div className="form-create-product"> 
            <form onSubmit={submitHandler} enctype="multipart/form-data">
                <ul className="form-container">
                    <li>
                        <h2>
                            {id?"Ενημέρωση Προϊόντος":"Δημιουργία Προϊόντος"} 
                        </h2>
                    </li>
                    <li>
                        {successSave && <div>Loading...</div>}
                        {errorSave && <div>{error}<br/>Η σύνδεση έληξε, παρακαλώ συνδεθείτε ξανά!</div>}                        
                    </li>
                    <li>
                        <label htmlFor="product-name">Όνομα:</label>
                        <input type="text" name="product-name" id="product-name" value={name} required
                        onChange={(e)=> setName(e.target.value)}>
                        </input>
                    </li>
                    <li>
                        <label htmlFor="product-brand">Κατασκευαστής:</label> 
                        {loadingManufacturer?<div>Loading...</div>:
                        errorManufacturer?<div>{errorManufacturer}</div>:
                        <select className="brand-list" onChange={(e)=>setBrand(e.target.value)}>
                        <option> Επέλεξε Κατασκευαστή</option>
                        {manufacturers.map(manufacturer=>
                        <option id={manufacturer.manufacturer_id} value={manufacturer.name} selected={manufacturer.name===brand}> {manufacturer.name}                     
                        </option >
                        )}
                        </select>}
                    </li>
                    <li>
                        <label htmlFor="product-category">Κατηγορία:</label>
                        {categoriesLoading?<div>Loading...</div>
                        :categoriesError?<div>{categoriesError}</div>
                        :
                        <select name="product-category" onChange={(e)=> categoryHandler(e)}>
                            <option>Επέλεξε Κατηγορία</option>
                            {categories.filter(cat=>cat.parent_id===null).map(cat=>
                                <option id={cat.category_id} value={cat.category} selected={cat.category===category}>{cat.category}</option>)}
                        </select>}
                    </li>
                    <li>
                        <label htmlFor="product-subcategory">Υποκατηγορία:</label>
                        {subcategoriesLoading?<div>Loading...</div>:
                        subcategoriesError?<div>{subcategoriesError}</div>:
                        <select className="product-subcategory" disabled={category==="Επέλεξε Κατηγορία"} onChange={(e)=>setSubcategory(e.target.value)}>
                        <option>Επέλεξε Υποκατηγορία</option>
                        {subcategories.map(sub=>
                            <option id={sub.category_id} value={sub.category} selected={sub.category===subcategory}>{sub.category}</option>)}
                        </select>}
                    </li>
                    {!id &&<li>         
                        <label htmlFor="product-image">Φωτογραφία:</label>            
                        <input type="file" name="product-image" id="product-image" required
                        accept=".jpg, .jpeg, .png" onChange={(e)=> setImage(e.target.files[0])}>
                        </input>
                    </li>}
                    <li>
                        <label htmlFor="product-price">Τιμή:</label> 
                        <input type="text" name="product-price" id="product-price" value={price} required
                        onChange={(e)=> setPrice(e.target.value)}>
                        </input>
                    </li>
                    <li>
                        <label htmlFor="product-price-percentage">Ποσοστό Κέρδους:</label> 
                        <input type="text" name="product-price-percentage" id="product-price-percentage" value={pricePercentage} required
                        onChange={(e)=> setPricePercentage(e.target.value)}>
                        </input>
                    </li>
                    <li>
                        <label htmlFor="product-description">Περιγραφή:</label>
                        <textarea name="product-description" id="product-description" value={description}
                        onChange={(e)=> setDescription(e.target.value)}>
                        </textarea>                    
                    </li>                
                    <li>
                        <button type="submit" className="button">{id?"Ενημέρωση":"Δημιουργία"}</button>
                    </li>
                    <li>
                        <button className="button" onClick={()=>setModalVisible(false)}>Επιστροφή</button>
                    </li>                
                </ul>
            </form>
            {id && <ul className="form-container feature-form">
                <li>
                    <h2>Συμβατότητα</h2>
                </li>
                <li>
                    <div>
                        <label htmlFor="company-list">Εταιρία:</label>
                        <select className="feature-list" id="company-list" name="company-list" onChange={(e)=>compatibilityCompaniesChangeHandler(e)}>
                            <option>Επέλεξε Εταιρία</option>
                            {loadingcompatibilityCompanies? <LoadingSpinner/>:
                            errorcompatibilityCompanies? <div>{errorcompatibilityCompanies}</div>:
                            companies.map(comp=>
                            <option id={comp.compatibility_company_id} value={comp.company}> {comp.company}                     
                            </option >
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="feature-list">Μοντέλο:</label>
                        <select className="feature-list" id="feature-list" name="feature-list" onChange={(e)=>setCompatibilityModel(e.target.value)}>
                            <option>Επέλεξε Μοντέλο</option>
                            {loadingCompatibilityModels? <LoadingSpinner/>:
                            errorCompatibilityModels? <div>{errorCompatibilityModels}</div>:
                            models.map(mod=>
                            <option id={mod.compatibility_model_id} value={mod.model}> {mod.model}                     
                            </option >
                            )}
                        </select>
                    </div>
                    <div>
                        <button className="button continuebtn" onClick={addCompatibility} disabled={compatibilityModel===""}>Προσθήκη</button>
                    </div>
                </li>
                <li>
                    <table>
                        <thead>
                        <th>Εταιρία</th>
                        <th>Μοντέλο</th>
                        <th>Ενέργεια</th>
                        </thead>
                        <tbody>
                        {loadingProductCompatibilities? <LoadingSpinner/>:
                        errorProductCompatibilities? <div>{featureListError}</div>:
                        productCompat.map(pr=>(
                            <tr key={pr.compatibility_id}>                     
                                <td>{pr.compatibility_company}</td>
                                <td>{pr.compatibility_model}</td>
                                <td>
                                    <button className="button admin-button" onClick={()=>deleteCompatibilityHandler(pr.compatibility_id)}>Διαγραφή</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </li>
                <hr></hr>
                <li>
                    <h2>Χαρακτηριστικά</h2>
                </li>
                <li>
                    <div>
                        <label htmlFor="feature-list">Τίτλος:</label>
                        <select className="feature-list" id="feature-list" name="feature-list" onChange={(e)=>featureTitleHandler(e)}>
                            <option>Τίτλος χαρακτηριστικού</option>
                            {featureTitleLoading? <LoadingSpinner/>:
                            featureTitleError? <div>{featureTitleError}</div>:
                            featureTitles.map(featureTitle=>
                            <option id={featureTitle.feature_title_id} value={featureTitle.feature_title}> {featureTitle.feature_title}                     
                            </option >
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="feature-list">Χαρακτηριστικό:</label>
                        <select className="feature-list" id="feature-list" name="feature-list" onChange={(e)=>setFeatureName(e.target.value)}>
                            <option>Χαρακτηριστικό</option>
                            {featureNamesLoading? <LoadingSpinner/>:
                            featureNamesError? <div>{featureNamesError}</div>:
                            featureNames.map(featureName=>
                            <option id={featureName.feature_name_id} value={featureName.feature_name}> {featureName.feature_name}                     
                            </option >
                            )}
                        </select>
                    </div>
                    <div>
                        <button className="button continuebtn" onClick={addFeature} disabled={featureName===""}>Προσθήκη</button>
                    </div>
                </li>
                <li>
                    <table>
                        <thead>
                        <th>Τίτλος</th>
                        <th>Χαρακτηριστικό</th>
                        <th>Ενέργεια</th>
                        </thead>
                        <tbody>
                        {featureListLoading? <LoadingSpinner/>:
                        featureListError? <div>{featureListError}</div>:
                        features.map(feature=>(
                            <tr key={feature.features_id}>                     
                                <td>{feature.feature_title}</td>
                                <td>{feature.feature}</td>
                                <td>
                                    <button className="button admin-button" onClick={()=>deleteFeatureHandler(feature.features_id)}>Διαγραφή</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </li>
            </ul>}
        </div>
        </div>
    </div>
}
    <div className="filter-container"> 
        <label htmlFor="product-category">Κατηγορία:</label>
        {categoriesLoading?<div>Loading...</div>
        :categoriesError?<div>{categoriesError}</div>
        :
        <select name="product-category" onChange={(e)=> categoryHandler(e)}>
            <option>Επέλεξε Κατηγορία</option>
            {categories.filter(cat=>cat.parent_id===null).map(cat=>
                <option id={cat.category_id} value={cat.category} selected={cat.category===category}>{cat.category}</option>)}
        </select>}
        <label htmlFor="product-subcategory">Υποκατηγορία:</label>
        {subcategoriesLoading?<div>Loading...</div>:
        subcategoriesError?<div>{subcategoriesError}</div>:
        <select className="product-subcategory" disabled={category==="Επέλεξε Κατηγορία"} onChange={(e)=>setSubcategory(e.target.value)}>
        <option>Επέλεξε Υποκατηγορία</option>
        {subcategories.map(sub=>
            <option id={sub.category_id} value={sub.category} selected={sub.category===subcategory}>{sub.category}</option>)}
        </select>}
        <button className="button admin-button" onClick={searchHandler}>Αναζήτηση</button>
    </div>
    <div className="product-list">
        <table className="product-table">
            <thead>
                <th>ID</th>
                <th>Φώτο</th>
                <th>Όνομα</th>                
                <th>Κατηγορία</th>
                <th>Υποκατηγορία</th>
                <th>Κατασκευαστής</th>
                <th>Τιμή Αγοράς</th>
                <th>Κέρδος</th>
                <th>Τελική Τιμή</th>
                <th>Προμηθευτής</th>
                <th>Εμφάνιση</th>
                <th>Ενέργεια</th>
            </thead>
            <tbody>
                {loading || successSave? <LoadingSpinner/>:
                error || errorSave?<div>{error}</div>:
                products.map(product=>(
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td><img className="admin-product-image" src={product.image} alt={props.alt}/></td>
                        <td><Link to={"/product/" + product._id}>{product.name}</Link></td>                        
                        <td>{product.category}</td>
                        <td>{product.subcategory}</td>
                        <td>{product.brand}</td>
                        <td>{product.price} €</td>
                        <td>{product.percentage}%</td>
                        <td>{(product.price*(100 + product.percentage)/100).toFixed(2)} €</td>
                        <td>{product.supplier}</td>
                        <td>
                            <input type="checkbox" name="visibility_checkbox" id="visibility_checkbox"
                            checked={product.visibility} onChange={(e)=>visibilityChangeHandler(product)}>
                            </input>                            
                        </td>
                        <td>
                            <button className="button admin-button" onClick={()=>openModal(product)}>Επεξεργασία</button>                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
}

export default AdminProductsScreen;