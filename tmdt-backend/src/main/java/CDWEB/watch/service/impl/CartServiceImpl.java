package CDWEB.watch.service.impl;

import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import CDWEB.watch.dto.CartItemRequest;
import CDWEB.watch.entity.Cart;
import CDWEB.watch.entity.CartItem;
import CDWEB.watch.entity.Product;
import CDWEB.watch.repository.CartItemRepository;
import CDWEB.watch.repository.CartRepository;
import CDWEB.watch.repository.ProductRepository;
import CDWEB.watch.service.CartService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserDetailRepository userDetailRepository;

    private UUID getUserIdFromPrincipal(Principal principal) {
        String username = principal.getName();
        User user = userDetailRepository.findByEmail(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getId();
    }

    @Override
    public Cart getCartByUserId(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElse(null);
    }

    @Override
    @Transactional
    public Cart getOrCreateCartForUser(Principal principal) {
        UUID userId = getUserIdFromPrincipal(principal);
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userDetailRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newCart = Cart.builder()
                    .user(user)
                    .totalPrice(0.0)
                    .totalQuantity(0)
                    .build();
            return cartRepository.save(newCart);
        });
    }

    @Override
    @Transactional
    public Cart addItemToCart(Principal principal, CartItemRequest cartItemRequest) {
        UUID userId = getUserIdFromPrincipal(principal);
        Cart cart = getOrCreateCartForUser(principal);
        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingCartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItemRequest.getProductId()))
                .findFirst();

        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
            cartItem.setItemPrice(product.getPrice().doubleValue());
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(cartItemRequest.getQuantity())
                    .itemPrice(product.getPrice().doubleValue())
                    .build();
            cart.getCartItems().add(cartItem);
        }
        cartItemRepository.save(cartItem);
        updateCartTotals(cart);
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart updateCartItemQuantity(Principal principal, UUID productId, int quantity) {
        UUID userId = getUserIdFromPrincipal(principal);
        Cart cart = getOrCreateCartForUser(principal);

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found in cart"));

        if (quantity <= 0) {
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        updateCartTotals(cart);
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeCartItem(Principal principal, UUID productId) {
        UUID userId = getUserIdFromPrincipal(principal);
        Cart cart = getOrCreateCartForUser(principal);

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found in cart"));

        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        updateCartTotals(cart);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(Principal principal) {
        UUID userId = getUserIdFromPrincipal(principal);
        Cart cart = getOrCreateCartForUser(principal);

        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        updateCartTotals(cart);
        cartRepository.save(cart);
    }

    private void updateCartTotals(Cart cart) {
        double totalPrice = 0.0;
        int totalQuantity = 0;
        for (CartItem item : cart.getCartItems()) {
            totalPrice += item.getItemPrice() * item.getQuantity();
            totalQuantity += item.getQuantity();
        }
        cart.setTotalPrice(totalPrice);
        cart.setTotalQuantity(totalQuantity);
        cart.setUpdateAt(LocalDateTime.now());
    }
} 