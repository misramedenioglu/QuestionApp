import { useState,  useEffect, useCallback } from "react";
import './App.css';


//soruların olduğu kısım.
const questions = [
  {
    question: "Çin Seddini oluşturan taşlar birbirine ne ile tutturulmuştur?",
    options: ["Bambu Harcı", "Anne Duası", "Pirinç Unu", "Noodle"],
    answer: "Pirinç Unu",
    media: "/src/assets/cin-seddi.jpg",
  },
  {
    question: "İlk Pamuk şekeri bulan kişinin mesleği nedir?",
    options: ["Gıda Mühendisi", "Diş Doktoru", "Ev Hanımı", "Güzellik Uzmanı"],
    answer: "Diş Doktoru",
    media: "/src/assets/pamuk.jpg",
  },
  {
    question:
      "Tarkan'ın 'Hüp' klibini izledikten sonra gaza gelip 'Tarkan keşke beni hüpletseydi' diye açıklamda bulunan kişi kimdir?",
    options: ["Gülben Ergen", "Hülya Avşar", "Harika Avcı", "Sevtap Parman"],
    answer: "Gülben Ergen",
    media: "/src/assets/tarkan.jpg",
  },
  {
    question: "Pteronofobi nedir?",
    options: [
      "Yeşil ışık yanar yanmaz korna çalacak korkusu",
      "Fakir kalma korkusu",
      "Taksi bulamama korkusu",
      "Kuş tüyüyle gıdıklanma korkusu",
    ],
    answer: "Kuş tüyüyle gıdıklanma korkusu",
    media: "/src/assets/fobi.jpg",
  },
  {
    question:
      "Ortalama ömürleri 5 yıl olan Japon balıklarının en uzun yaşayanı Tish, bütün istatistikleri alt üst ederek kaç yıl boyunca hayata tutunmayı başarmıştır?",
    options: ["43", "78", "23", "99"],
    answer: "43",
    media: "/src/assets/balik.jpg",
  },
  {
    question:
      "90'lara damgasını vuran 'Bandıra Bandıra' şarkısının söz yazarı kimdir?",
    options: ["Sezen Aksu", "Sibel Can", "Mustafa Sandal", "Bülent Ersoy"],
    answer: "Mustafa Sandal",
    media: "/src/assets/bandira.jpg",
  },
  {
    question:
      "Hangi şarkıcımız yine kendisi gibi şarkıcı olan sevgilisinden ayrıldıktan sonra tam evinin karşısındaki apartmanın tamamını kendi posteriyle kaplatmıştır?",
    options: ["Hande Yener", "Hadise", "Gülşen", "Simge"],
    answer: "Hadise",
    media: "/src/assets/billboard.jpg",
  },
  {
    question: "Antik Roma'da kadınlar parfüm olarak ne kullanıyordu?",
    options: ["Gül Suyu", "Bal", "Gladyatör Teri", "Kan"],
    answer: "Gladyatör Teri",
    media: "/src/assets/parfum.jpg",
  },
  {
    question: "T-Rex'in yaşayan en yakın akrabası aşağıdakilerden hangisidir?",
    options: ["İnekler", "Tavuklar", "Timsahlar", "Köpekler"],
    answer: "Tavuklar",
    media: "/src/assets/trex.jpg",
  },
  {
    question:
      "Her şeyin olduğu gibi mutluluğun da fobisi varmış. Bu fobiye ne ad verilir?",
    options: ["Çerofobi", "Euphobia", "Felicifobia", "Mutluluk Korkusu"],
    answer: "Çerofobi",
    media: "/src/assets/fobi.jpg",
  },
];


// Ana App bileşeni
function App() {
  // Durum değişkenleri tanımlanıyor
  const [quizStarted, setQuizStarted] = useState(false); // Quizin başlatılıp başlatılmadığını kontrol eder
  const [currentQuestion, setCurrentQuestion] = useState(0); // Mevcut sorunun indeksini tutar
  const [correctCount, setCorrectCount] = useState(0); // Doğru cevap sayısını tutar
  const [timeLeft, setTimeLeft] = useState(2); // Kalan süreyi tutar
  const [showOptions, setShowOptions] = useState(false); // Seçeneklerin görünürlüğünü kontrol eder
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Kullanıcının seçtiği cevabı tutar
  const [quizEnded, setQuizEnded] = useState(false); // Quizin bitip bitmediğini kontrol eder
  const [userAnswers, setUserAnswers] = useState([]); // Kullanıcının cevaplarını tutar
  const [showNextButton, setShowNextButton] = useState(false); // "Sonraki Soru" butonunun görünürlüğünü kontrol eder

  const QUESTION_TIMER = 7;

  const handleNextQuestion = useCallback(() => {
    setShowOptions(false);
    setShowNextButton(false);
  
    // Eğer cevap seçilmemişse ve bu soru daha önce eklenmemişse boş olarak kaydet
    if (!selectedAnswer && !quizEnded) {
      const alreadyAnswered = userAnswers.find(
        (answers) => answers.question == questions[currentQuestion].question
      );
  
      if (!alreadyAnswered) {
        setUserAnswers((prevAnswers) => [
          ...prevAnswers,
          {
            question: questions[currentQuestion].question,
            userAnswer: "Boş Bırakıldı",
            correctAnswer: questions[currentQuestion].answer,
          },
        ]);
      }
    }
  
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(QUESTION_TIMER);
      setSelectedAnswer("");
    } else {
      setQuizEnded(true);
      setQuizStarted(false);
    }
  }, [currentQuestion, selectedAnswer, quizEnded, userAnswers]);

  // Timer ve seçenek gösterimi için effect
  useEffect(() => {
    let timer;
    if (quizStarted && currentQuestion < questions.length) {
      // Seçeneklerin görünürlüğünü ayarlamak için zamanlayıcı
      const showOptionsTimeout = setTimeout(() => {
        setShowOptions(true); // Seçenekleri göster
      }, 4000);

      // Süreyi azaltmak için zamanlayıcı
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) { // Süre dolduysa
            clearInterval(timer); // Zamanlayıcıyı temizle
            handleNextQuestion(); // Sonraki soruya geç
            return QUESTION_TIMER; // Süreyi sıfırla
          }
          return prevTime - 1; // Süreyi 1 azalt
        });
      }, 1000);

      return () => {
        clearTimeout(showOptionsTimeout); // Zamanlayıcıyı temizle
        clearInterval(timer); // Zamanlayıcıyı temizle
      };
    }
  }, [quizStarted, currentQuestion]);

  // Kullanıcı cevabını seçme işlevi
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option); // Seçilen cevabı ayarla
    setShowNextButton(true); // "Sonraki Soru" butonunu göster
    if (option === questions[currentQuestion].answer) { // Eğer cevap doğruysa
      setCorrectCount(correctCount + 1); // Doğru cevap sayısını artır
    }
    // Kullanıcı cevaplarını güncelle
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestion].question,
        userAnswer: option,
        correctAnswer: questions[currentQuestion].answer,
      },
    ]);
  };


  // Quiz başlatma işlevi
  const startQuiz = () => {
    setQuizStarted(true); // Quiz başlat
    setQuizEnded(false); // Quiz bitti bayrağını sıfırla
    setCurrentQuestion(0); // İlk soruya dön
    setTimeLeft(QUESTION_TIMER); // Süreyi sıfırla
    setCorrectCount(0); // Doğru cevap sayısını sıfırla
    setUserAnswers([]); // Kullanıcı cevaplarını sıfırla
  };

  return (
    <div className="App">
      {/* Quiz başlamadıysa ve bitmediyse başlangıç ekranı */}
      {!quizStarted && !quizEnded ? (
        <div className="start-screen">
          <h1>Quiz Uygulamasına Hoş Geldiniz!</h1>
          <p>Testimiz 10 sorudan oluşmaktadır. Başladıktan sonra geçmiş sorulara dönemezsiniz ve her soru için 30 saniyeniz var. Hadi başlayalım!</p>
          <button id="start" onClick={startQuiz}>Teste Başla</button>
        </div>
      ) : quizEnded ? ( // Eğer quiz bitmişse sonuç ekranı
        <div className="result-screen">
          <h2>Test Sonucu</h2>
          <p>Doğru Cevap Sayısı: {correctCount}</p>
          <p>Yanlış Cevap Sayısı: {questions.length - correctCount}</p>
          <div className="answers-list">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.userAnswer === answer.correctAnswer ? "correct" : "incorrect"}`}>
                <p><strong>Soru:</strong> {answer.question}</p>
                <p><strong>Senin Cevabın:</strong> {answer.userAnswer}</p>
                {answer.userAnswer !== answer.correctAnswer && ( // Eğer cevap yanlışsa doğru cevabı göster
                  <p><strong>Doğru Cevap:</strong> {answer.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
          <button onClick={startQuiz}>Tekrar Dene</button> {/* Quiz tekrar başlatma butonu */}
        </div>
      ) : (
        // Eğer quiz devam ediyorsa mevcut soru ekranı
        <div className="question-screen">
          {/* Mevcut soru numarasını göster */}
          <h2>Soru {currentQuestion + 1} / {questions.length}</h2>
          <h3>{questions[currentQuestion].question}</h3>
          
          {/* Seçilen cevap alanı */}
          <div className="selected-label">Seçilen cevap:</div>
          <div className="selected-answer">{selectedAnswer || "Henüz bir cevap seçilmedi."}</div>
          
          {/* Soruya ait görsel */}
          <img
            src={questions[currentQuestion].media}
            alt="Question media"
            className="question-image"
          />
          {showOptions && ( // Seçenekler görünürse göster
            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleAnswerSelect(option)} // Seçenek seçildiğinde cevap seçme işlevini çağır
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="timer">
            <h3>Süre: {timeLeft} saniye</h3> {/* Kalan süreyi göster */}
          </div>
          {showNextButton && ( // "Sonraki Soru" butonunu göster
            <button className="next-button" onClick={handleNextQuestion}>Sonraki Soru</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App; 
