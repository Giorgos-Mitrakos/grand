import React from 'react';
import './FilterContainer.css';
import LoadingSpinner from './LoadingSpinner';

function FilterContainer(props) {
    return(
        <div className="filter-wrapper">
            {props.loadingFeatureTitles? <LoadingSpinner/>:
            props.errorFeatureTitles? <div>{props.errorFeatureTitles}</div>: 
            <div>
            <ul className="filter-features">
                <li>
                    {props.featureTitles.map(x=>
                    <li>{x.feature_title} :
                        {props.featureNames.map(y=>(y.feature_title===x.feature_title) && 
                        <li>
                            <input type="checkbox" className="filterByFeatures" value={y.feature}
                            onChange={(e)=>props.filterHandler(e.target.checked,e.target.value)}></input>
                            <label>{y.feature}</label>
                        </li>)}
                    </li>)}
                </li>
            </ul>
            </div>}
            <div>
            {props.loadingCompatibilities?<LoadingSpinner/>:
                props.errorCompatibilities?<div>{props.errorCompatibilities}</div>:
                props.compatibilities.length!==0 &&
                <div className="filter-compatibility">                     
                    <ul>
                        <li>Συμβατότητα: </li>
                        {props.compCompanies.map(comp=>
                        <li key={comp}>
                            <input type="checkbox" className="filterByCompatibilityCompanies" value={comp} onChange={(e)=>props.filterByCompatibilityCompany(e.target.checked,e.target.value)}></input>
                            <label>{comp}</label>
                        </li>)}
                    </ul>                    
                </div>
            }
            <div className="filter-compatibility">                    
                <ul>
                    {props.compModels && props.compModels.length!==0 &&<li><label>Μοντέλα: </label></li>}
                    {props.compModels &&
                    props.compModels.map(mod=>
                    <li key={mod}>
                        <input type="checkbox" className="filterByCompatibilityCompanies" value={mod} onChange={(e)=>props.filterByCompatibilityModel(e.target.checked,e.target.value)}></input>
                        <label>{mod}</label>
                    </li>
                        )}
                </ul>
            </div>
            </div>
            {props.uniqueBrands && props.uniqueBrands.length!==0 && props.subcategory!=="Θήκες-Κινητών" && props.subcategory!=="Προστασία-Οθόνης" && props.subcategory!=="Θήκες-Tablet" &&
            <div className="brandsListWrapper">                
                <ul className="brandsList">
                    <li>Κατασκευαστής :</li>
                    {props.uniqueBrands.map((x, index)=>
                    <li key={index}>
                        <input type="checkbox" className="filterByFeatures" value={x} onChange={(e)=>props.filterBrandHandler(e.target.checked,e.target.value)}></input>
                        <label>{x}</label>
                    </li>)}
                </ul>
            </div>}
        </div>
    )
}

export default FilterContainer