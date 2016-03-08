$.getJSON("/template/js/options.json?nocache=123", jsonCallback);
         
        function jsonCallback(options){
            var d = document,
                categoryNum = d.querySelector('.LeftWrapper p').innerText,
                category = options[categoryNum],
                colors = options.productColors;
            var COLOR = (function(){
                var c = {
                    init: function(){
                        c.cache();
                        c.loop();
                    },
                    cache: function(){
                        c.itemNumList = d.querySelectorAll('#CategoryContent .ProductDetails i span');
                    },
                    loop: function(){
                        for (var i = 0 ; i < c.itemNumList.length ; i++){
                            for (var products in colors) {
                                var colorNum = colors[products];
                            }
                        }
                    }
                }
                c.init();
            })();

            //  Category Filter Component
            //  category#  >  FilterName: ["this", "this"] in options.json file act as filters
            var FILTER = (function(){         
                var g = {
                    init: function(){
                        g.cacheOnce();
                        g.cache();
                        g.eventListener();
                        g.insertLabels();
                        g.showAllProducts();
                        g.filterFromURL();
                    },
                    cacheOnce: function(){
                        g.fieldset = d.querySelector('fieldset');
                        g.filterError = d.querySelector('.filter-error');
                        g.filterResetBtn = d.querySelector('.filter-error button');
                        g.$filterBtn = $('.filter-button');
                        g.$genderFilter = $('.gender-filter');
                    },
                    cache: function(){
                        g.productList = d.querySelectorAll('.pname');
                        g.showMoreBtn = d.querySelector('.endless-load-more');
                        g.allProducts = d.querySelectorAll('.main .ProductList > li');
                        g.hiddenProducts = d.querySelectorAll('.main .ProductList > li.hide-important');
                        g.allOption = d.querySelectorAll('fieldset input[value="all"]');
                    },
                    insertLabels: function(){
                        
                        g.filterOptionsList = [];
                        
                        //Get JSON data for filter options and paint the labels on the component
                        for(var filterName in category) {
                            var filterOption = category[filterName];
                            g.filterOptionsList.push(filterOption);
                            g.fieldset.innerHTML += '<legend>' + filterName + '</legend>';
                            g.fieldset.innerHTML += '<label for="' + filterName + '-all"><input type="radio" name=' + filterName +' id="' + filterName +'-all" value="all" checked/>All</label>'
                            for (var i = 0; i < filterOption.length; i++) {
                                g.fieldset.innerHTML += '<label for="' + filterOption[i] + '"><input type="radio" value="' + filterOption[i] + '" name="' + filterName + '" id="' + filterOption[i] + '" />' + filterOption[i] + '</label>';
                            }
                        }
                        console.log(g.filterOptionsList);                      
                    },
                    eventListener: function(){
                        //filter option click
                        g.fieldset.addEventListener("click", function(e){
                           g.cache();
                            if (e.target && e.target.nodeName == "INPUT"){
                                g.targetInput = e.target;
                                g.addHash();
                                g.recacheFilters();
                                g.applyFilter();
                                if (g.showMoreBtn){
                                    g.showMoreBtn.click();
                                    g.loadingGif = d.querySelectorAll('.endless-loading');
                                }
                            }
                        });
                        //reset btn click
                        g.filterResetBtn.addEventListener("click", function(){
                            for (var i = 0; i < g.allOption.length; i++) {
                                g.allOption[i].click();
                            } 
                        });
                        //mobile filter button click
                        g.$filterBtn.on("click", function(){
                           g.$genderFilter.slideToggle();
                        });
                    },
                    addHash: function(){
                        history.pushState(null,null,"#" + g.targetInput.value);
                        console.log(g.filterOptionsList.length)
                    },
                    filterFromURL: function(){
                        if (window.location.hash) {
                            var currentHash = window.location.hash.replace('#','');
                            for (var i = 0; i < g.filterOptionsList.length  ; i++) {
                                console.log('lit');
                            }
                        } else {
                            console.log('else');
                        }
                    },
                    applyFilter: function(){
                        g.hideError();
                        g.hideAllProducts();
                        if (g.filteredChecked.length == 0){
                            g.showAllProducts();
                        } else {
                            for (var l = 0; l < g.productList.length; l++){
                                var checker = 0;
                                for (var i = 0; i < g.filteredChecked.length; i++){
                                    if (g.productList[l].innerText.indexOf(g.filteredChecked[i]) > -1 ){
                                        checker++;
                                        if ( checker == g.filteredChecked.length ) {
                                            g.productList[l].parentNode.parentNode.classList.remove("hide-important");
                                            g.productList[l].parentNode.parentNode.classList.add("show-inline");
                                        }
                                    }
                                }
                            }
                        }
                        g.cache();
                        if ((g.allProducts.length == g.hiddenProducts.length) && (g.showMoreBtn === null)) {
                            g.showError();
                        }
                    },
                    showError: function(){
                        g.filterError.classList.add("show-inline");
                    },
                    hideError: function(){
                        g.filterError.classList.remove("show-inline");
                    },
                    recacheFilters: function(){
                        var getCheckedBoxes = function(){
                            g.checkedBoxes = Array.prototype.slice.call(d.querySelectorAll("fieldset input:checked"));
                            g.filteredChecked = [];
                            for (var i = 0; i < g.checkedBoxes.length; i++){
                                g.filteredChecked.push(g.checkedBoxes[i].value);
                            }
                            g.filteredChecked = g.filteredChecked.filter(function(e){return e!=='all'})
                        }
                        getCheckedBoxes();           
                    },
                    hideAllProducts: function(){
                        for(var i = 0; i < g.productList.length ; i++) {
                            g.productList[i].parentNode.parentNode.classList.remove("show-inline");
                            g.productList[i].parentNode.parentNode.classList.add("hide-important");
                        }
                    },
                    showAllProducts: function(){
                        for(var i = 0; i < g.productList.length ; i++) {
                            g.productList[i].parentNode.parentNode.classList.remove("hide-important");
                            g.productList[i].parentNode.parentNode.classList.add("show-inline");
                        }
                    }
                }
                g.init();
                
            })();
            
            /* Sibling Categories and Subcategories Component */
            var CAT = (function() {
                
                //upper menu DOM cache
                var breadcrumb = d.getElementById("CategoryBreadcrumb"),
                    breadcrumbCategory = breadcrumb.getElementsByClassName("last")[0],
                    currentMainCat = breadcrumb.querySelector(".last li:nth-of-type(2) a"),
                    currentBreadcrumb = breadcrumb.querySelector(".last li:last-of-type"),
                    currentParent = breadcrumb.querySelector(".last li:nth-last-child(2) a"),
                    selectParentCat = breadcrumbCategory.getElementsByTagName("li")[1],
                    activeCat = selectParentCat.innerText,
                    subMenu = d.querySelector(".LeftWrapper .Left");
                
                //side menu DOM cache
                var subMenuParent = {},
                    subMenuDepth = {},
                    subMenuDepthAll = {};
                
                //desktop
                var Subcat = {
                    init: function(){
                        this.removeSpan();
                        this.iterateMenu();
                        this.paintMenu();
                        this.createExpandBtn();
                        this.eventBinder();
                        this.createSubMenuArray();       
                    },
                    eventBinder: function(){
                        subMenu.addEventListener("click", this.clickHandler);
                    },
                    clickHandler: function(e){
                        if ((e.target && e.target.nodeName == "LI")) {
                            var classes = e.target.className.split(" ");
                            for (var i = 0; i < classes.length; i++) {
                                if (classes[i] == "nextdepth") {
                                    e.target.classList.toggle("showDepth");
                                }
                            }
                        }
                        if ((e.target && e.target.nodeName == "DIV")) {
                            var parentClasses = e.target.parentNode.className.split(" ");
                            for (var i = 0; i < parentClasses.length; i++) {
                                if (parentClasses[i] == "nextdepth") {
                                    e.target.parentNode.classList.toggle("showDepth");
                                }
                            }
                        }
                    },
                    iterateMenu: function(){       
                        Subcat.menuCategories = d.querySelectorAll(".PageMenu .SideCategoryListFlyout > ul > li > a");
                        for(var i = 0; i < Subcat.menuCategories.length; i++) {
                            if((Subcat.menuCategories[i].innerText.toLowerCase()) == activeCat.toLowerCase()){
                                Subcat.activeCatMenu = Subcat.menuCategories[i].nextSibling;
                            }
                        } 
                        if (currentMainCat){
                            d.querySelector(".LeftWrapper h2").innerText = currentMainCat.innerText;
                        } else {
                            d.querySelector(".LeftWrapper h2").innerText = currentBreadcrumb.innerText;
                        }
                    },
                    paintMenu: function(){
                        subMenu.innerHTML = Subcat.activeCatMenu.innerHTML;
                        Subcat.subMenuAll = d.querySelectorAll(".Left > li > a");
                        subMenuParent = d.querySelectorAll(".Left > .nextdepth");
                        subMenuDepth = d.querySelectorAll(".Left > .nextdepth > ul");
                        subMenuDepthAll = d.querySelectorAll(".Left > .nextdepth > ul > li > a");
                    },
                    createExpandBtn: function(){
                        for (var i = 0; i < subMenuParent.length ; i++) {
                            subMenuParent[i].appendChild(d.createElement('div'));
                            subMenuParent[i].lastChild.className += "addBtn";
                        }
                    },
                    createSubMenuArray: function(){
                        Subcat.subMenuArray = [].slice.call(Subcat.subMenuAll);
                        subMenuDepthAll = [].slice.call(subMenuDepthAll);
                        Array.prototype.push.apply(Subcat.subMenuArray, subMenuDepthAll);
                        Subcat.childCat = breadcrumb.querySelector(".last li:nth-of-type(4)");
                        for (var i = 0; i < Subcat.subMenuArray.length; i++) {                   
                            if(((Subcat.subMenuArray[i].innerHTML.toLowerCase()) == currentParent.innerHTML.toLowerCase())
                            && (Subcat.childCat != null)){
                                Subcat.subMenuArray[i].parentNode.className += " showDepth";
                                Subcat.currentParentArray = Subcat.subMenuArray[i].parentNode.querySelectorAll('ul > li > a'); 
                                var parentArrayLength = Subcat.currentParentArray.length;         
                                for (var j = 0; j < Subcat.currentParentArray.length ; j++) {
                                    if (Subcat.currentParentArray[j].innerHTML == currentBreadcrumb.innerHTML) {
                                        Subcat.currentParentArray[j].className += " boldActive";
                                    }
                                }
                            }
                        };
                        
                        if(Subcat.childCat === null) {
                            for (var i = 0; i < Subcat.subMenuArray.length; i++){
                                if(Subcat.subMenuArray[i].innerHTML == currentBreadcrumb.innerHTML) {
                                    Subcat.subMenuArray[i].className += " boldActive";
                                    Subcat.subMenuArray[i].parentNode.className += " showDepth";
                                }
                            }
                        };
                    },
                    showDepth: function(e){
                        e.target.classList.toggle("showDepth");
                    },
                    removeSpan: function(){
                        var unneededSpan = d.querySelectorAll("span.sf-sub-indicator");
                        for (var i = 0; i < unneededSpan.length ; i++) {
                            unneededSpan[i].parentNode.removeChild(unneededSpan[i]);
                        }
                    },
                };
                
                //mobile
                var SubcatM = {
                    init: function(){
                        this.cache();
                        this.btnClickBind();
                        this.getArrays();
                        this.findCurrentPos();
                    },
                    cache: function(){
                        SubcatM.relatedBtn = d.querySelector(".related-button");
                        SubcatM.toggleMenu = d.getElementById("ToggleMenu");
                        SubcatM.mobileMenu = d.querySelectorAll("#DrawerMenu ul.sf-menu > li > a");
                    },
                    btnClickBind: function(){
                        SubcatM.relatedBtn.addEventListener("click", this.openMenu)
                    },
                    openMenu: function(){
                        SubcatM.toggleMenu.click();
                    },
                    getArrays: function(){
                        SubcatM.mobileMenuParents = [];
                        for (var i = 0; i < SubcatM.mobileMenu.length; i++) {
                            SubcatM.mobileMenuParents.push(SubcatM.mobileMenu[i]);
                        }
                    },
                    findCurrentPos: function() {
                        if (currentMainCat){
                            for (var i = 0; i < SubcatM.mobileMenuParents.length; i++) {
                                if (SubcatM.mobileMenuParents[i].innerHTML == currentMainCat.innerHTML) {
                                    SubcatM.mobileMenuParents[i].parentNode.className += " sfHover";
                                    SubcatM.mobileMenuParents[i].parentNode.querySelector("span img").className += " triangledown";
                                    SubcatM.mobileSubCats = SubcatM.mobileMenuParents[i].parentNode.querySelector("ul");
                                    SubcatM.mobileSubCats.className += " expanded";
                                }
                            }
                        }
                    }
                }
                Subcat.init();
//                SubcatM.init();
            })();
            
        }
