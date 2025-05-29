import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function App() {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("Все");
  const [darkMode, setDarkMode] = useState(false);

  // Пользователь
  const currentUser = {
    name: "Валентина Леунова",
    username: "@yalavochka",
    avatar: "https://picsum.photos/seed/user/200/200 "
  };

  // Все места
  const allPlaces = [
    {
      id: 1,
      name: "Ровесник",
      type: "Бары",
      location: "Малый Гнездниковский пер., 9, стр. 2",
      image: "https://picsum.photos/seed/bar1/600/400 "
    },
    {
      id: 2,
      name: "HSE Art Gallery",
      type: "Галереи",
      location: "4-й Сыромятнический пер., 1/8c21",
      image: "https://picsum.photos/seed/art1/600/400 "
    },
    {
      id: 3,
      name: "Masa Madre",
      type: "Пекарни",
      location: "ул. Солянка, 1/2c1",
      image: "https://picsum.photos/seed/bakery1/600/400 "
    }
  ];

  // Рекомендации от друзей
  const feedItems = [
    {
      id: 1,
      user: "Анастасия",
      place: {
        name: "Ровесник",
        category: "Бары",
        address: "Малый Гнездниковский пер., 9, стр. 2",
        hours: "Ежедневно, 12:00–2:00",
        image: "https://picsum.photos/seed/bar1/600/400 "
      },
      review: {
        rating: 5,
        text: "Очень атмосферное место для вечеров с друзьями. Вкуснейшие коктейли и душевная музыка!",
        date: "2 дня назад"
      }
    },
    {
      id: 2,
      user: "Даниил",
      place: {
        name: "HSE Art Gallery",
        category: "Галереи",
        address: "4-й Сыромятнический пер., 1/8c21",
        hours: "Вт–Вс: 10:00–20:00",
        image: "https://picsum.photos/seed/art1/600/400 "
      },
      review: {
        rating: 5,
        text: "Настоящее волшебство! Здесь можно часами смотреть на картины и чувствовать себя частью искусства.",
        date: "3 дня назад"
      }
    },
    {
      id: 3,
      user: "Ирина",
      place: {
        name: "Masa Madre",
        category: "Пекарни",
        address: "ул. Солянка, 1/2c1",
        hours: "Ежедневно, 8:00–20:00",
        image: "https://picsum.photos/seed/bakery1/600/400 "
      },
      review: {
        rating: 4,
        text: "Лучший кофе в районе и хрустящий багет! Иногда шумно, но очень вкусно.",
        date: "4 дня назад"
      }
    }
  ];

  // Друзья
  const friends = [
    {
      id: 1,
      name: "Анастасия",
      phone: "+7 (900) 123-45-67",
      avatar: "https://picsum.photos/seed/friend1/200/200 ",
      reviewsCount: 89,
      favoritesCount: 22,
      friendsCount: 10,
      reviews: [
        {
          id: 1,
          user: "Анастасия",
          place: "Ровесник",
          rating: 5,
          text: "Отличный бар с живой музыкой по пятницам и крутой командой людей.",
          date: "2 дня назад",
          avatar: "https://picsum.photos/seed/friend1/200/200 "
        }
      ]
    },
    {
      id: 2,
      name: "Даниил",
      phone: "+7 (910) 234-56-78",
      avatar: "https://picsum.photos/seed/friend2/200/200 ",
      reviewsCount: 67,
      favoritesCount: 18,
      friendsCount: 12,
      reviews: [
        {
          id: 1,
          user: "Даниил",
          place: "HSE Art Gallery",
          rating: 5,
          text: "Любимое место для неспешных прогулок и вдохновения.",
          date: "3 дня назад",
          avatar: "https://picsum.photos/seed/friend2/200/200 "
        }
      ]
    },
    {
      id: 3,
      name: "Ирина",
      phone: "+7 (920) 345-67-89",
      avatar: "https://picsum.photos/seed/friend3/200/200 ",
      reviewsCount: 54,
      favoritesCount: 15,
      friendsCount: 9,
      reviews: [
        {
          id: 1,
          user: "Ирина",
          place: "Masa Madre",
          rating: 4,
          text: "Уютная пекарня с домашним теплом и свежими круассанами.",
          date: "4 дня назад",
          avatar: "https://picsum.photos/seed/friend3/200/200 "
        }
      ]
    }
  ];

  // State формы
  const [reviewData, setReviewData] = useState({
    placeId: "",
    rating: 5,
    text: ""
  });

  const [newListTitle, setNewListTitle] = useState("");

  // Списки избранного
  const [favoriteLists, setFavoriteLists] = useState([
    { id: 1, title: "Любимые места" },
    { id: 2, title: "Хочу посетить" }
  ]);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (!WebApp) return;

    WebApp.ready();
    WebApp.setHeaderTitle("Локатор");

    // Тема
    if (WebApp.colorScheme === "dark") setDarkMode(true);
    WebApp.onEvent("themeChanged", () => {
      setDarkMode(WebApp.themeParams.bg_color !== "#ffffff");
    });

    // MainButton
    WebApp.MainButton.setText("Добавить отзыв");
    WebApp.MainButton.onClick(() => setShowAddReviewModal(true));
    WebApp.MainButton.show();

    return () => {
      WebApp.MainButton.hide();
    };
  }, []);

  // При выборе места обновляем данные
  const selectedPlace = allPlaces.find(p => p.id === parseInt(reviewData.placeId)) || {
    name: "",
    location: ""
  };

  // Сохранение отзыва
  const handleSubmit = () => {
    if (!reviewData.placeId) {
      alert("Выберите место");
      return;
    }

    if (WebApp && WebApp.CloudStorage) {
      WebApp.CloudStorage.setItem(
        `review_${reviewData.placeId}`,
        JSON.stringify({
          ...reviewData,
          date: new Date().toLocaleDateString(),
          user: currentUser.name
        }),
        (err) => {
          if (!err) {
            WebApp.HapticFeedback.notificationOccurred("success");
            alert(`Отзыв на "${selectedPlace.name}" сохранён`);
          }
        }
      );
    } else {
      alert("Сохранение недоступно в этом браузере");
    }

    setShowAddReviewModal(false);
  };

  // Переход к профилю друга
  if (selectedUserId) {
    const friend = friends.find(f => f.id === selectedUserId);

    return (
      <div className="p-4">
        {/* Кнопка назад */}
        <button onClick={() => setSelectedUserId(null)} className="text-[#B9F61F] mb-4">← Назад</button>

        {/* Аватар и имя */}
        <h2 className="text-xl font-bold text-center">{friend.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">@{friend.username}</p>
        <img src={friend.avatar} alt="Avatar" className="w-20 h-20 rounded-full mx-auto my-4" />

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div><div className="font-bold">{friend.reviewsCount}</div><div className="text-sm text-gray-500">Отзывы</div></div>
          <div><div className="font-bold">{friend.favoritesCount}</div><div className="text-sm text-gray-500">Избранное</div></div>
          <div><div className="font-bold">{friend.friendsCount}</div><div className="text-sm text-gray-500">Друзья</div></div>
        </div>

        {/* Последние отзывы друга */}
        <h3 className="mt-6 font-semibold">Последние отзывы</h3>
        {friend.reviews.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow mt-2">
            <div className="flex items-center">
              <img src={r.avatar} alt={r.user} className="w-8 h-8 rounded-full mr-2" />
              <span>{r.user}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="font-medium">{r.place}</span>
              <div className="flex ml-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < r.rating ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm">{r.text}</p>
          </div>
        ))}

        {/* Кнопка выхода */}
        <button
          onClick={() => setSelectedUserId(null)}
          className="mt-6 w-full bg-[#B9F61F] hover:bg-green-500 text-black dark:text-white py-2 rounded-lg"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} font-sans transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm p-4 flex justify-center items-center sticky top-0 z-10 transition-colors`}>
        <h1 className="text-xl font-bold">Локатор</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto pt-16 pb-20">
        {activeTab === "recommendations" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Рекомендации</h2>

            {/* Feed List */}
            {feedItems.map(item => (
              <div key={item.id} className={`${darkMode ? "bg-gray-800" : "bg-white"} mb-6 rounded-xl overflow-hidden shadow-sm transition-colors`}>
                <img src={item.place.image} alt={item.place.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">{item.user} порекомендовал(а):</p>
                  <h3 className="text-lg font-medium mt-1">{item.place.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.place.address}</p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < item.review.rating ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.review.text}</p>
                </div>
              </div>
            ))}

            {/* Floating Button */}
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="fixed bottom-20 right-6 z-20 w-14 h-14 bg-[#B9F61F] hover:bg-green-500 text-black dark:text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              +
            </button>
          </>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Избранное</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["Все", "Бары", "Галереи", "Пекарни"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap ${categoryFilter === cat ? "bg-[#B9F61F] text-black" : "bg-gray-200 text-gray-700"} transition`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              {allPlaces
                .filter(place => categoryFilter === "Все" || place.type === categoryFilter)
                .map(place => (
                  <div key={place.id} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm flex items-center transition-colors`}>
                    <img src={place.image} alt={place.name} className="w-16 h-16 rounded-lg object-cover mr-3" />
                    <div>
                      <h3 className="font-medium">{place.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{place.type}, {place.location}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Друзья</h2>
            {friends.map(friend => (
              <div
                key={friend.id}
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer mb-4 transition-colors`}
                onClick={() => setSelectedUserId(friend.id)}
              >
                <div className="flex items-center">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <h3 className="font-medium">{friend.name}</h3>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Профиль</h2>
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm text-center transition-colors`}>
              <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#B9F61F]" />
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-gray-500">@{currentUser.username}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div><div className="font-bold">124</div><div className="text-sm text-gray-500">Отзывы</div></div>
                <div><div className="font-bold">37</div><div className="text-sm text-gray-500">Избранное</div></div>
                <div><div className="font-bold">15</div><div className="text-sm text-gray-500">Друзья</div></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal - Add Review */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-30">
          <div
            className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl p-4 w-full max-w-md animate-slide-up"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Оставить отзыв</h3>

            {/* Выбор места */}
            <label className="block mb-2 text-sm font-medium">Выберите место</label>
            <select
              value={reviewData.placeId}
              onChange={(e) => setReviewData({ ...reviewData, placeId: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4"
            >
              <option>-- Выберите место --</option>
              {allPlaces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Название заведения */}
            <label className="block mb-2 text-sm font-medium">Название заведения</label>
            <input
              type="text"
              readOnly
              value={selectedPlace.name}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
            />

            {/* Адрес заведения */}
            <label className="block mb-2 text-sm font-medium">Адрес</label>
            <input
              type="text"
              readOnly
              value={selectedPlace.location}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
            />

            {/* Оценка звёздами */}
            <label className="block mb-2 text-sm font-medium">Оценка</label>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setReviewData({ ...reviewData, rating })}
                  className="focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={reviewData.rating >= rating ? "#B9F61F" : "none"}
                    stroke="#B9F61F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              ))}
            </div>

            {/* Текст отзыва */}
            <label className="block mb-2 text-sm font-medium">Текст отзыва</label>
            <textarea
              value={reviewData.text}
              onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
              rows="3"
              placeholder="Поделитесь своим опытом..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4"
            ></textarea>

            {/* Избранное */}
            <label className="block mb-2 text-sm font-medium">Добавить в список</label>
            <ul className="space-y-2 mb-4">
              {favoriteLists.map(list => (
                <li key={list.id}>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="accent-[#B9F61F]" />
                    <span>{list.title}</span>
                  </label>
                </li>
              ))}
              <li className="pt-2">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Новый список..."
                  className="w-full p-2 border rounded border-gray-300 dark:border-gray-600"
                />
              </li>
            </ul>

            {/* Кнопки модального окна */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg w-full text-center"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-[#B9F61F] hover:bg-green-500 text-black dark:text-white rounded-lg w-full text-center"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 z-10">
        {[
          { name: "Рекомендации", icon: "🧭", tab: "recommendations" },
          { name: "Избранное", icon: "⭐", tab: "favorites" },
          { name: "Друзья", icon: "👥", tab: "friends" },
          { name: "Профиль", icon: "👤", tab: "profile" }
        ].map(tab => (
          <button
            key={tab.tab}
            onClick={() => {
              setActiveTab(tab.tab);
              if (WebApp?.HapticFeedback) WebApp.HapticFeedback.impactOccurred("light");
            }}
            className="flex flex-col items-center"
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
