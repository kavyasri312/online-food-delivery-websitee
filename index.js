$(document).ready(function () {
  // =========================
  // Section switching
  // =========================
  $(".Menu, .menucontainer, .order.details, .delivery-form, .Contact").hide();
  $(".search-section, .Categories, .food-container").show();

  $(".btn").click(function () {
    const value = $(this).val().toLowerCase();

    // Hide all sections
    $(".search-section, .Categories, .food-container, .Menu, .menucontainer, .order.details, .delivery-form, .Contact").hide();

    switch (value) {
      case "home":
        $(".search-section, .Categories, .food-container").show();
        break;
      case "categories":
        $(".Categories, .food-container").show();
        break;
      case "menu":
        $(".Menu, .menucontainer").show();
        $(".menu-card").show(); // Show all menu items
        break;
      case "order":
        $(".order.details, #orderTable, .delivery-form").show();
        break;
      case "contact":
        $(".Contact, .delivery-form").show();
        break;
    }
  });

  // =========================
  // Search Functionality
  // =========================
  $("#searchBtn").click(function () {
    const query = $("#searchInput").val().toLowerCase().trim();
    if (query === "") {
      alert("Please enter a food name.");
      return;
    }

    // Open Menu section
    $(".search-section, .Categories, .food-container").hide();
    $(".Menu, .menucontainer").show();

    // Hide all menu cards
    $(".menu-card").hide();

    // Show only the menu card that matches the search
    let found = false;
    $(".menu-card").each(function () {
      const itemName = $(this).find("h3").text().toLowerCase();
      if (itemName === query) {
        $(this).show();
        found = true;
      }
    });

    if (!found) {
      alert("Sorry, item not found in menu.");
    }
  });

  // =========================
  // Add to Cart Functionality
  // =========================
  let serial = 1;

  $(document).on("click", ".add-to-cart", function () {
    const card = $(this).closest(".menu-card");
    const name = card.find("h3").text();
    const price = parseFloat(card.find(".price").text().replace("Rs.", ""));
    const qty = parseInt(card.find("input[type='number']").val()) || 1;
    const total = price * qty;

    // Add to cart table
    $("#cart-content").append(`
      <tr>
        <td>${serial++}</td>
        <td contenteditable="true">${name}</td>
        <td contenteditable="true">Rs.${price}</td>
        <td contenteditable="true">${qty}</td>
        <td>Rs.${total}</td>
        <td><button class="btn-delete">Delete</button></td>
      </tr>
    `);

    updateTotal();

    // Show Order Confirmation Form
    $(".order.details, .delivery-form").show();
  });

  // =========================
  // Add Manual Row
  // =========================
  $("#addRow").click(function () {
    $("#cart-content").append(`
      <tr>
        <td>${serial++}</td>
        <td contenteditable="true">Enter Item</td>
        <td contenteditable="true">Rs.0</td>
        <td contenteditable="true">1</td>
        <td>Rs.0</td>
        <td><button class="btn-delete">Delete</button></td>
      </tr>
    `);
  });

  // =========================
  // Delete item from cart
  // =========================
  $(document).on("click", ".btn-delete", function () {
    $(this).closest("tr").remove();
    updateTotal();
  });

  // =========================
  // Update grand total
  // =========================
  function updateTotal() {
    let total = 0;
    $("#cart-content tr").each(function () {
      let priceText = $(this).find("td:nth-child(3)").text().replace("Rs.", "").trim();
      let qtyText = $(this).find("td:nth-child(4)").text().trim();

      let price = parseFloat(priceText);
      let qty = parseInt(qtyText);

      if (!isNaN(price) && !isNaN(qty)) {
        let rowTotal = price * qty;
        $(this).find("td:nth-child(5)").text("Rs." + rowTotal);
        total += rowTotal;
      }
    });
    $("#grandTotal").text("Rs." + total);
  }

  // =========================
  // Confirm Order Submission
  // =========================
  $(".delivery-form form").submit(function (e) {
    e.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const address = $("#address").val();

    if (!name || !email || !phone || !address) {
      alert("Please fill all delivery details.");
      return;
    }

    alert(`Thank you ${name}! Your order has been placed successfully.`);

    // Clear form & table
    $(this)[0].reset();
    $("#cart-content").empty();
    $("#grandTotal").text("Rs.0");
    serial = 1;

    // Go back to home page
    $(".Menu, .menucontainer, .order.details, .delivery-form, .Contact").hide();
    $(".search-section, .Categories, .food-container").show();
  });

  // =========================
  // Recalculate total if table is edited manually
  // =========================
  $(document).on("input", "#cart-content td", function () {
    updateTotal();
  });
});
