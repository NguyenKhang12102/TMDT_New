package CDWEB.watch.service;

import CDWEB.watch.dto.CartItemRequest;
import CDWEB.watch.entity.Cart;
import CDWEB.watch.entity.CartItem;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface CartService {
    Cart getCartByUserId(UUID userId);
    Cart getOrCreateCartForUser(Principal principal);
    Cart addItemToCart(Principal principal, CartItemRequest cartItemRequest);
    Cart updateCartItemQuantity(Principal principal, UUID productId, int quantity);
    void removeCartItem(Principal principal, UUID productId);
    void clearCart(Principal principal);
} 