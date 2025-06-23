package CDWEB.watch.controller;

import CDWEB.watch.dto.CartItemRequest;
import CDWEB.watch.entity.Cart;
import CDWEB.watch.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Cart> getUserCart(Principal principal) {
        Cart cart = cartService.getOrCreateCartForUser(principal);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Cart> addItemToCart(Principal principal, @RequestBody CartItemRequest cartItemRequest) {
        Cart updatedCart = cartService.addItemToCart(principal, cartItemRequest);
        return new ResponseEntity<>(updatedCart, HttpStatus.OK);
    }

    @PutMapping("/update-quantity/{productId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Cart> updateCartItemQuantity(Principal principal, @PathVariable UUID productId, @RequestParam int quantity) {
        Cart updatedCart = cartService.updateCartItemQuantity(principal, productId, quantity);
        return new ResponseEntity<>(updatedCart, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> removeCartItem(Principal principal, @PathVariable UUID productId) {
        cartService.removeCartItem(principal, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 