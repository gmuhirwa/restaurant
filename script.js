$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  (function (global) { // this is a window object.
    var dc = {};
    var homeHtml = "snippets/home-snippet.html"; // Where the snippet gonna sit
    var allCategoriesUrl = "http://davis-restaurant.herohuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

  // Convinience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {  // givene a selector and html, embed another html
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;

  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";  // Ajax will display content
    insertHtml(selector, html);

  };

  // Retrun substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
  
  // On first load, show home view
  showLoading ("#main-content");
  $ajaxUtils.sendgetRequest(
    homeHtml,
    function (responseText) {
      document.querySelector("#main-content").innerHTML = responseText;
  },
  false);
  });

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML, true);  // true is default
  };

  // Builds HTML for the categories page based on the data
  // from the server
  function buildShowCategoriesHTML (categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendgetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendgetRequest(
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml = buildShowCategoriesHTML (categories,
                                                              categoriesTitleHtml,
                                                              categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
      false);
  
  },
  false);
  }

  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHTML(categories,
                                   categoriesTitleHtml,
                                   categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short-name = categories[i].short_name;
      html = insertProperty(html, "name", name );
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }
  global.$dc = dc;   // Resto short name
  }) (window);