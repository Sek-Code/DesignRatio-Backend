titie mongodb collection
- products -> Ready,(Custom->ไม่ใช้ราคาสุดท้ายต้องประกอบร่างก่อน),stock_count,product_id,created_at,upddate_at /1
- components (item in invetory ที่ไม่ได้ขายโดนตรง *Ingredients,packagings,bases,),stock_count,created_at,upddate_at /2
<!-- - users,created_at,upddate_at -->
- orders (user_id,created_at,upddate_at,order_items[array of obj->same data as cart],deliverie_option,total_order_price,payment_option,status_order(payment_status,deliverie_status))/5
- carts (product_id,quantity,->ready),(product_id,totalprice,bases,ingredients->custom),user_id,created_at,upddate_at/3
- deliveries(created_at,upddate_at)/4