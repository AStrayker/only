import telebot

# Создаем бота и передаем ему токен
bot = telebot.TeleBot('5714136586:AAElE94BUnqtYCvHQ6J5bExcG7MMNmGtvLU')

# Задаем словарь товаров, где ключом является id товара, а значением - название и цена товара
products = {
    1: {'name': 'Товар 1', 'price': 100},
    2: {'name': 'Товар 2', 'price': 200},
    3: {'name': 'Товар 3', 'price': 300}
}

# Задаем словарь корзины, где ключом является id пользователя, а значением - список товаров в корзине
cart = {}

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def start_message(message):
    bot.send_message(message.chat.id, 'Привет! Я бот интернет-магазина. Доступные команды:\n/catalog - список товаров\n/cart - корзина')

# Обработчик команды /catalog
@bot.message_handler(commands=['catalog'])
def catalog_message(message):
    # Отправляем список товаров
    for product_id, product in products.items():
        bot.send_message(message.chat.id, f'{product_id}. {product["name"]} - {product["price"]} руб.')

# Обработчик команды /cart
@bot.message_handler(commands=['cart'])
def cart_message(message):
    user_id = message.chat.id
    cart_items = cart.get(user_id, [])
    if not cart_items:
        bot.send_message(message.chat.id, 'Ваша корзина пуста')
    else:
        total_price = sum(products[item_id]['price'] for item_id in cart_items)
        bot.send_message(message.chat.id, f'Ваша корзина:\n{"\n".join([products[item_id]["name"] for item_id in cart_items])}\nИтого: {total_price} руб.')

# Обработчик сообщений с номером товара
@bot.message_handler(func=lambda message: message.text.isdigit())
def add_to_cart(message):
    user_id = message.chat.id
    product_id = int(message.text)
    if product_id in products:
        if user_id not in cart:
            cart[user_id] = []
        cart[user_id].append(product_id)
        bot.send_message(message.chat.id, f'Товар "{products[product_id]["name"]}" добавлен в корзину')
    else:
        bot.send_message(message.chat.id, 'Такого товара нет в наличии')

# Запускаем бота
bot.polling()