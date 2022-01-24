
const generateJSX = async (masterLayout, page, pageIndex) => {
  return new Promise((resolve, reject) => {
    let jsxCode = `import React from "react";
    import Layout from "../Components/PageLayout/Layout";`;
    let buttonInfo = []
    let optList = page.componentList.filter(
      (comp) =>
        comp.type == "Radio" ||
        comp.type == "DropDown" ||
        comp.type == "CheckBox"
    );
    let initialValues = {}, componentOptions = {};
    optList.forEach((comp) => {
      if(comp.type === 'CheckBox')
        initialValues[comp.attributes.id] = [];
      else
        initialValues[comp.attributes.id] = "";
        //if(comp.type === 'DropDwon') {
          if(typeof comp.attributes.options == "string" ) {
            let options = []
            comp.attributes.options.split(",").forEach((option, index) => {
              options.push({key:index, value: option, label: option})
              componentOptions[comp.attributes.id + "Options"] = options
            })
          }
    //}
    });
let Imagcmp = page.componentList.find((comp) => comp.type == 'Image')
if (Imagcmp) {
  let imagUrl = Imagcmp.attributes.url
    ? '../Images/'+Imagcmp.attributes.url
    : "../Images/Humaaans.png";
  jsxCode = jsxCode + `\n import image from "${imagUrl}";`;
}
    var compArry = [...new Set(page.componentList.map((comp) => comp.type))];
    compArry.forEach((component) => {
      
      if (component == "TextInput") {
        jsxCode =
          jsxCode +
          `\n import InputText from "../Components/FormComponent/InputComponent/InputText";`;
      }
      if (component == "DropDown") {
        jsxCode =
          jsxCode +
          `\n import SelectInputBox from "../Components/FormComponent/SelectInputBox/SelectInputBox";`;
      }
      if(component == "Radio") {
        jsxCode =
          jsxCode +
          `\n import SelectInputBox from "../Components/FormComponent/RadioInputButton/RadioInputButton";`;
      }
      if (component == "ButtonComponent") {
        jsxCode =
          jsxCode +
          `\n import ButtonComponent from "../Components/FormComponent/Button/Button";`;
      }
    });
    let compMap =[];
     page.componentList.forEach((component, index) => {
       if(component.type == 'TextInput') {
         if(component.attributes.type == 'date') {
           let cmpJsx = `<InputText type='date' label="${component.attributes.label}"  />`
           compMap.push({comName:'TextInput', cmpJsx: cmpJsx})
          }
          if(component.attributes.type == 'number') {
            let cmpJsx = `<InputText type='number' label="${component.attributes.label}"  />`
            compMap.push({comName:'TextInput', cmpJsx: cmpJsx})
           }
           if(component.attributes.type == 'email') {
            let cmpJsx = `<InputText type='email' label="${component.attributes.label}"  />`
            compMap.push({comName:'TextInput', cmpJsx: cmpJsx})
           }else {
            let cmpJsx = `<InputText type='text' label="${component.attributes.label}" />`
            compMap.push({comName:'TextInput', cmpJsx: cmpJsx})
           }
       }
       if(component.type == 'DropDown') {
        let cmpJsx = `<div className="input-box">
        <p>Select  ${component.attributes.label}</p>
        <SelectInputBox
          handleChange={handleChangeSelect}
          options={componentOptions.${component.attributes.id}Options}
        />
      </div> `
        compMap.push({comName:'DropDown', cmpJsx: cmpJsx})
       }
       if(component.type == 'Radio') {
        let cmpJsx = `div className="input-box">
        <p>Select ${component.attributes.label} </p>
        <RadioInputButton radioList={componentOptions.${component.attributes.id}Options}/>
      </div> `
        compMap.push({comName:'RadioButton', cmpJsx: cmpJsx})
       }
    })
    let textContainer = page.componentList.find((comp) => comp.type == 'TextContainer')
   // jsxCode=jsxCode + `\n const heading = ${textContainer.attributes.label}`
   const heading = textContainer ? `\n const heading = "${textContainer.attributes.label}"` : ''
    if (pageIndex != 0) {
      buttonInfo.push({ label: "Back", path: masterLayout.pageNames[pageIndex - 1].pageName.replace(/\s/g, '')})
    } 
    if (pageIndex == 0 && masterLayout.pageNames.length > pageIndex + 1) {
      buttonInfo.push({ label: "Continue", path: masterLayout.pageNames[pageIndex + 1].pageName.replace(/\s/g, '')})
    } 
    if (masterLayout.pageNames.length == pageIndex + 1) {
      buttonInfo.push({ label: "Issue", path:"/"})
    }
    

    jsxCode =
      jsxCode +
      `\n const ${page.pageName.replace(/\s/g, '')} = (props) => {
        \n ${heading}
        const handleChangeSelect = (param) => {
          console.log(param.getAttribute("value"));
        };
        const handleChange = (e) => {
          console.log(e.target.value);
        };
        const componentOptions = JSON.parse(${JSON.stringify(componentOptions)})
        const buttonInfo = JSON.parse(${JSON.stringify(buttonInfo)} )
        `+`
        return (
          <>
            <Layout
              img={image}
              heading={heading}
              btnInfo={buttonInfo}
            >
            ${compMap.map((comp) => `${comp.cmpJsx}`).join("\n")}  
            `
            +`
            </Layout>
            </>
            );
          };
      export default ${page.pageName.replace(/\s/g, '')};
`;
    resolve(jsxCode);
  });
};
const generateRouteJSX = async (masterLayout) => {
  return new Promise((resolve, reject) => {
    let routeImprtJsx = `import React from "react";
    import { BrowserRouter as Switch, Routes, Route } from "react-router-dom";
    import { BrowserRouter as Switch, Routes, Route } from "react-router-dom";
    import NavBar from "./Components/NavBar/NavBar";
    import Home from "./views/Home";`
    let routeNavjsx = ''

    masterLayout.pages.forEach((page) => {
      routeImprtJsx = routeImprtJsx = `\n import ${page.pageName} from "./views/${page.pageName}"; 
      `
      routeNavjsx = routeNavjsx + `\n<Route exact path="/${page.pageName}" element={<${page.pageName}/>} />`
    })
    let routeJsx = `${routeImprtJsx}
    \n
    const PageNav = () => {
      return (
        <>
          <NavBar formTabs={navTabs}/>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            \n${routeNavjsx}
          </Routes>
        </>
      );
    };
    
    export default PageNav;
    `
    resolve(routeJsx);
  })
}

module.exports = { generateJSX,  generateRouteJSX};
