// ========================================================================= //
//  Main Navigation
// ========================================================================= //
jQuery(document).ready(function () {
  jQuery(window).scroll(function () {
    var scroll = jQuery(window).scrollTop();

    if (scroll < 50) {
      jQuery(".header").css("background", "none");
      jQuery(".main-nav").css("max-height", "unset");
      jQuery(".site-logo img").css("max-height", "3rem");
      jQuery(".sidebar .closebtn").css("top", "14px");
      document.getElementById("header").style.top = "10px";
    } else {
      jQuery(".header").css("background", "#333333");
      jQuery(".main-nav").css("max-height", "70px");
      jQuery(".main-nav ul a").css("font-size", "16px");
      jQuery(".site-logo img").css("max-height", "2rem");
      jQuery(".sidebar .closebtn").css("top", "0px");
      document.getElementById("header").style.top = "0px";
    }
  });
});

// ========================================================================= //
//  Sidebar Menu
// ========================================================================= //
function openMainNav() {
  document.getElementById("hamburger-main-nav").style.width = "100%";
}
function closeMainNav() {
  document.getElementById("hamburger-main-nav").style.width = "0";
}

// ========================================================================= //
//  //global $, jQuery, alert*/
// ========================================================================= //
$(document).ready(function () {
  "use strict";

  // ========================================================================= //
  //  //SMOOTH SCROLL
  // ========================================================================= //
  $(document).on("scroll", onScroll);

  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    $(document).off("scroll");

    $("a").each(function () {
      $(this).removeClass("active");
      if ($(window).width() < 768) {
        $(".nav-menu").slideUp();
      }
    });

    $(this).addClass("active");

    var target = this.hash,
      menu = target;

    target = $(target);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: target.offset().top - 80,
        },
        500,
        "swing",
        function () {
          window.location.hash = target.selector;
          $(document).on("scroll", onScroll);
        }
      );
  });

  function onScroll(event) {
    if ($(".home").length) {
      var scrollPos = $(document).scrollTop();
      $("nav ul li a").each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
      });
    }
  }

  // ========================================================================= //
  //  //NAVBAR SHOW - HIDE
  // ========================================================================= //
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 200) {
      $("#main-nav, #main-nav-subpage").slideDown(700);
      $("#main-nav-subpage").removeClass("subpage-nav");
    } else {
      $("#main-nav").slideUp(700);
      $("#main-nav-subpage").hide();
      $("#main-nav-subpage").addClass("subpage-nav");
    }
  });

  // ========================================================================= //
  //  // RESPONSIVE MENU
  // ========================================================================= //
  $(".responsive").on("click", function (e) {
    $(".nav-menu").slideToggle();
  });
});

// ========================================================================= //
//  Porfolio isotope and filter
// ========================================================================= //
var path = window.location.pathname;
var isHome = path === "" || path === "/" || path === "/index.html" || path.endsWith("/");

if (isHome) {
  $(window).on('load', function () {
    if ($(".portfolio-container").length > 0) {
      var portfolioIsotope = $(".portfolio-container").isotope({
        itemSelector: ".portfolio-thumbnail",
        layoutMode: "fitRows",
      });
      
      $("#portfolio-flters li").on("click", function () {
        $("#portfolio-flters li").removeClass("filter-active");
        $(this).addClass("filter-active");

        portfolioIsotope.isotope({ 
          filter: $(this).data("filter") 
        });
      });
    }
    
  });
}
