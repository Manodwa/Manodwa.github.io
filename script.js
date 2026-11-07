// Catalogue de démonstration : modifie les noms, prix et photos ici.
// Les prix et stocks sont des exemples à remplacer par tes informations réelles.
const products = [
  { id: 1, name: "T-shirt classique", category: "Vêtements", price: 7500, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", rating: "4.8" },
  { id: 2, name: "Téléphone portable", category: "Téléphones", price: 0, image: "https://images.unsplash.com/photo-1511704518677-bd4f8c6f4a3d?auto=format&fit=crop&w=600&q=80", rating: "Bientôt", comingSoon: true },
  { id: 3, name: "Montre élégante", category: "Montres", price: 25000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", rating: "4.7" },
  { id: 4, name: "Sac à main", category: "Sacs", price: 18000, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", rating: "4.6" },
  { id: 5, name: "Parfum", category: "Parfums", price: 15000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80", rating: "4.8" },
  { id: 6, name: "Ordinateur portable", category: "Ordinateurs", price: 250000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", rating: "4.7" },
  { id: 7, name: "Baskets tendance", category: "Vêtements", price: 22000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", rating: "4.8" },
  { id: 8, name: "Casque Bluetooth", category: "Accessoires", price: 12000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", rating: "4.5" }
];

const cart = [];
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartMessage = document.getElementById("cartMessage");
let activeCategory = "";
let searchTerm = "";

function money(value) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

function renderProducts() {
  productGrid.replaceChildren();
  const filtered = products.filter(product => {
    const matchesSearch = (product.name + " " + product.category)
      .toLocaleLowerCase("fr").includes(searchTerm);
    const matchesCategory = !activeCategory ||
      product.category === activeCategory ||
      (activeCategory === "Téléphones" && product.category === "Téléphones") ||
      (activeCategory === "Sacs" && product.category === "Sacs");
    return matchesSearch && matchesCategory;
  });

  document.getElementById("emptyMessage").classList.toggle("hidden", filtered.length !== 0);

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.onerror = () => {
      image.remove();
      imageWrap.textContent = "🛍️";
      imageWrap.style.fontSize = "48px";
    };
    imageWrap.appendChild(image);

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = product.comingSoon ? "Bientôt disponible" : money(product.price);

    const rating = document.createElement("div");
    rating.className = "product-meta";
    rating.textContent = product.comingSoon ? "À découvrir prochainement" : "★ " + product.rating + " · Article démo";

    const button = document.createElement("button");
    button.className = "button";
    button.textContent = product.comingSoon ? "Être informé" : "🛒 Ajouter au panier";
    button.addEventListener("click", () => {
      if (product.comingSoon) {
        cartMessage.textContent = "Ce produit sera proposé dès que tu l'auras en stock.";
        return;
      }
      cart.push(product);
      cartMessage.textContent = "";
      renderCart();
    });

    card.append(imageWrap, name, price, rating, button);
    productGrid.appendChild(card);
  });
}

function renderCart() {
  cartItems.replaceChildren();
  cartCount.textContent = String(cart.length);

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Votre panier est vide pour le moment.";
    cartItems.appendChild(empty);
  } else {
    cart.forEach((product, index) => {
      const line = document.createElement("div");
      line.className = "cart-line";
      const label = document.createElement("span");
      label.textContent = product.name + " — " + money(product.price);
      const remove = document.createElement("button");
      remove.className = "remove-button";
      remove.textContent = "Retirer";
      remove.addEventListener("click", () => {
        cart.splice(index, 1);
        renderCart();
      });
      line.append(label, remove);
      cartItems.appendChild(line);
    });
  }

  const total = cart.reduce((sum, product) => sum + product.price, 0);
  cartTotal.textContent = "Total : " + money(total);
}

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim().toLocaleLowerCase("fr");
  activeCategory = "";
  renderProducts();
  document.getElementById("produits").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLocaleLowerCase("fr");
  activeCategory = "";
  renderProducts();
});

document.querySelectorAll("[data-category]").forEach(link => {
  link.addEventListener("click", () => {
    activeCategory = link.dataset.category;
    searchTerm = "";
    document.getElementById("searchInput").value = "";
    renderProducts();
  });
});

document.getElementById("showAll").addEventListener("click", () => {
  activeCategory = "";
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  renderProducts();
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    cartMessage.textContent = "Ajoute au moins un produit avant de continuer.";
    return;
  }
  cartMessage.textContent = "Ta commande est prête à être développée. Aucun achat ni paiement réel n'a été effectué : il faudra connecter le serveur et un prestataire de paiement.";
});

renderProducts();
renderCart();
