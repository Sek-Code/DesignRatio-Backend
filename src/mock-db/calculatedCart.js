//calculateUnitPrice การคำนวนตัวเลขของ (item) ในตระกร้าสินค้า
export function calculateUnitPrice(item) {

    // กรณีที่ 1 สินค้าสำเร็จรูปจะมีราคาต่อชิ้นเป็น
    // ราคาที่มากับ item อยู่แล้วไม่มีการคำนวนเพิ่มเติม
    if (item.type === "ready") {
        return item.price;
    }

    // กรณีที่ 2 คือสินค้าที่สามารถ Customize ได้
    if (item.type === "custom") {
        //คำนวนราคา teabase
        //item.bases = array ของชา base ที่ลูกค้าเลือก
        //(item.bases || []) ถ้าไม่มี bases
        const basePrice = (item.bases || []).reduce(
            (sum, base) => sum + base.price, 0
        );

        const ingredientPrice = (item.ingredients || []).reduce(
            (sum, ing) => sum + ing.price, 0
        );

        return basePrice + ingredientPrice;
    }

    return 0;
}

export function calculateItemTotal (item) {
    const unitPrice = calculateUnitPrice(item);
    return unitPrice * item.quantity;
}

export function calculateCart(cart){
    const updatedItem = cart.item.map((item) => {
        const unitPrice = calculateUnitPrice(item);
        const totalPrice = unitPrice * quantity;

    return{
        ...item,
        price: unitPrice,
        totalPrice,
    };
    });

    const grandTotal = updatedItem.reduce(
        (sum, item) => sum + item.totalPrice, 0
    );

    return {
        ...item,
        price: totalPrice,
        grandTotal
    };
};