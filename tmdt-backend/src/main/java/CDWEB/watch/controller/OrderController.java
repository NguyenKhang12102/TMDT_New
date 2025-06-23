package CDWEB.watch.controller;



import CDWEB.watch.auth.dto.OrderResponse;
import CDWEB.watch.dto.OrderDetails;
import CDWEB.watch.dto.OrderRequest ;
import CDWEB.watch.dto.ProductDto;
import CDWEB.watch.service.OrderService;
import CDWEB.watch.service.ProductService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {


    @Autowired
    OrderService orderService;

    @Autowired
     ProductService productService;


    @GetMapping
    public ResponseEntity<List<OrderDetails>> getAllOrders() {
        List<OrderDetails> orders = orderService.getAllOrders();
        String contentRange = "orders 0-" + (orders.size() - 1) + "/" + orders.size();
        return ResponseEntity.ok()
                .header("Content-Range", contentRange)
                .body(orders);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetails> getOrderById(@PathVariable UUID id) {
        OrderDetails order = orderService.getOrderById(id);
        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) throws Exception {
        OrderResponse orderResponse = orderService.createOrder(orderRequest,principal);
        //return new ResponseEntity<>(order, HttpStatus.CREATED);

        return new ResponseEntity<>(orderResponse,HttpStatus.OK);
    }

    @PostMapping("/update-payment")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody Map<String,String> request){
        try{
            Map<String,String> response = orderService.updateStatus(request.get("paymentIntent"),request.get("status"));
            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID id,Principal principal){
        orderService.cancelOrder(id,principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDetails>> getOrderByUser(Principal principal) {
        List<OrderDetails> orders = orderService.getOrdersByUser(principal.getName());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/update-status/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable UUID id, @RequestBody Map<String,String> request){
        try {
            orderService.updateOrderStatus(id,request.get("status"));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
