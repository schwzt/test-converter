import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [valuteList, setValuteList] = useState([]); //массив валют для использования в селекте
  const [convertTo, setConvertTo] = useState("USD"); //выбранное значение, в какую валюту перевести
  const [fromAmount, setFromAmount] = useState(1); //сумма рублей для перевода
  const [exchangeRate, setExchageRate] = useState(1); //коэффицент перевода
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("Email не может быть пустым"); //значение ошибки
  const [emailWrong, setEmailWrong] = useState(false); //значение правильно или нет заполнено поле

  // хук, который будет срабатывать при первом рендере страницы и при каждом изменении значения валюты перевода
  useEffect(() => {
    const fetchValute = async () => {
      const res = await axios.get("https://www.cbr-xml-daily.ru/daily_json.js"); //запрос к центробанку
      setValuteList([...Object.keys(res.data.Valute)]);
      setExchageRate(res.data.Valute[convertTo].Value);
    };
    fetchValute();
  }, [convertTo]);

  //Проверка значения формы
  const emailHandler = (e) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailErr("Некорректный email");
    } else {
      setEmailErr("");
    }
  };

  let result;
  //рассчет суммы в валюте
  if (fromAmount) {
    result = (fromAmount * exchangeRate).toFixed(4);
  } else {
    result = fromAmount;
  }

  //функция для отправки заявки
  const sendEmail = async (e) => {
    e.preventDefault();
    let formData = JSON.stringify({
      email,
      convertTo,
      fromAmount,
      result,
    });
    try {
      let res = await axios.post("http://localhost/index.php", formData);
      alert("Заявка отправлена!");
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ф-ция выводяшая ошибку, если такая есть, при потере фокуса эл-та
  const blurHandler = (e) => {
    if (e.target.name === "email") {
      setEmailWrong(true);
    }
  };
  return (
    <div className="converter">
      <h1 className="converter__title">Конвертер валют</h1>
      <form
        className="converter__form"
        action="#"
        method="post"
        onSubmit={sendEmail}
      >
        <label htmlFor="fromAmount">Сумма, руб</label>
        <input
          type="number"
          name="fromAmount"
          className="converter__input"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
        />
        <label htmlFor="convertTo">Валюта для конвертации</label>
        <select
          name="convertTo"
          value={convertTo}
          onChange={(e) => setConvertTo(e.target.value)}
          className="converter__input"
        >
          {valuteList.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label htmlFor="result">Сумма в валюте</label>
        <input
          type="text"
          className="converter__input"
          name="result"
          value={result}
          readOnly
        />
        <label htmlFor="email">Email</label>
        {emailWrong && emailErr && (
          <div style={{ color: "red" }}>{emailErr}</div> //вывод ошибки если она есть
        )}
        <input
          type="email"
          name="email"
          className="converter__input"
          onChange={(e) => emailHandler(e)}
          value={email}
          onBlur={(e) => blurHandler(e)}
          required
        />
        <button disabled={emailErr} className="converter__btn" type="submit">
          Записаться на обмен валюты
        </button>
      </form>
    </div>
  );
}

export default App;
