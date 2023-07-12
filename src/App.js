
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { SiProbot } from "react-icons/si";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [hasText, setHasText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
    setMenuOpen(false);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
    setMenuOpen(false);
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle, //what we are saving
          role: <FaUserCircle className="user-icon" />,
          content: value,
        },
        {
          title: currentTitle,
          role: <SiProbot className="bot-icon" />, //what we are saving from the ai
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app">
      {isMobile && (
        <div className="menu-icon" onClick={handleMenuToggle}>
          <div className={`hamburger ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {menuOpen && (
            <ul className="mobile-menu">
              <li onClick={createNewChat}>New Chat</li>
              {uniqueTitles?.map((uniqueTitle, index) => (
                <li key={index} onClick={() => handleClick(uniqueTitle)}>
                  {uniqueTitle}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!isMobile && (
        <section className="side-bar">
          <button onClick={createNewChat}>+ New Chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => (
              <li key={index} onClick={() => handleClick(uniqueTitle)}>
                {uniqueTitle}
              </li>
            ))}
          </ul>
          <nav>
            <p>Made by Omar</p>
          </nav>
        </section>
      )}
      <section className="main">
        {!currentTitle && <h1>OmarGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setHasText(e.target.value.length > 0);
              }}
            />
            <div
              id="submit"
              className={hasText ? "active-button" : ""}
              onClick={getMessages}
            >
              ➢
            </div>
          </div>
          <p className="info">
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts. ChatGPT May 24 Version
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
