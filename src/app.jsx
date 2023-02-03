import { useState, useRef } from "preact/hooks";
import { Configuration, OpenAIApi } from "openai";
import { SpinnerCircular } from "spinners-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import { useForm } from "react-hook-form";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export function App() {
  const [isLoading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("correctg");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const resultAreaRef = useRef();
  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(
        resultAreaRef.current.innerHTML.toString()
      );
      toast("Copied to Clipboard", { theme: "dark" });
    } catch (err) {
      toast("Failed to copy to Clipboard", { theme: "dark" });
    }
  };

  const getResponse = async (data) => {
    setLoading(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        currentView == "correctg"
          // ? `"${data.prompt}" correct the grammar`
          ? `"${data.prompt}" correct the grammar`
          : currentView == "rephrase"
          ? `"${data.prompt}" rephrase it`
          : `Find alternative words for "${data.prompt}" separated by comma`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    resultAreaRef.current.innerHTML = response.data.choices[0].text;
    setLoading(false);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav>
        <h1 className="app-title">Correct My Grammar</h1>
        <div className="nav-items">
          <div
            className={
              currentView == "correctg" ? "nav-item selected-nav" : "nav-item"
            }
            onClick={() => setCurrentView("correctg")}
          >
            Correct Grammar
          </div>
          <div
            className={
              currentView == "rephrase" ? "nav-item selected-nav" : "nav-item"
            }
            onClick={() => setCurrentView("rephrase")}
          >
            Rephrase Sentences
          </div>
          <div
            className={
              currentView == "alternative"
                ? "nav-item selected-nav"
                : "nav-item"
            }
            onClick={() => setCurrentView("alternative")}
          >
            Find alternative words
          </div>
        </div>
      </nav>
      <div className="app">
        <h2>Free AI Grammar assistant (English)</h2>
        <div className="entry-split">
          <div className="user-side">
            <h3>Enter your Sentence (or) Paragraph</h3>
            <form onSubmit={handleSubmit(getResponse)}>
              <textarea
                type="text"
                {...register("prompt")}
                placeholder="Paste (or) type your sentence here"
              />
              {currentView == "correctg" ? (
                <button type="submit" className="correct-grammar-btn">
                  {isLoading ? (
                    <>
                      <SpinnerCircular thickness={200} color={"#000"} />
                      <span>Correcting Your Grammar</span>
                    </>
                  ) : (
                    <>
                      <span>Click to Correct Your Grammar</span>
                    </>
                  )}
                </button>
              ) : currentView == "rephrase" ? (
                <button type="submit" className="correct-grammar-btn">
                  {isLoading ? (
                    <>
                      <SpinnerCircular thickness={200} color={"#000"} />
                      <span>Rephrasing the Sentence</span>
                    </>
                  ) : (
                    <>
                      <span>Click to Rephrasing</span>
                    </>
                  )}
                </button>
              ) : (
                <button type="submit" className="correct-grammar-btn">
                  {isLoading ? (
                    <>
                      <SpinnerCircular thickness={200} color={"#000"} />
                      <span>Finding alternative words</span>
                    </>
                  ) : (
                    <>
                      <span>Click to find alternative words</span>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
          <div className="ai-side">
            <h3>Grammar corrected sentence (or) Paragraph</h3>
            <div className="ai-result" ref={resultAreaRef}></div>
            <button className="correct-grammar-btn" onClick={copyToClipBoard}>
              Copy Result
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
