import React from "react";
import ReactDOM from "react-dom";
import * as S from "sanctuary";
import * as SD from "sanctuary-def";
import { LoadingView, ErrorView, SuccessView } from "./view";
const dirs = ["myDir1", "myDir2", "myDir3", "myDir4"];
const myobj = {
  myID3: {
    myDir1: ["a", "a", "a", "b"],
    myDir2: ["a"],
    myDir3: [],
    myDir4: ["a", "b"]
  }
};

const consoleLeft = func => param => {
  console.error(param);
  return func(param);
};
const consoleIdentity = consoleLeft(x => x);
const atPath = S.gets(S.is(SD.Array(SD.String)));
const getDirectoryLength = dir => cr =>
  S.fromMaybe([])(atPath([String(cr.ID), String(dir)])(myobj)).length;
const getTotalImagesFromDir = passedDirs => cr =>
  S.reduce(total => nextDir => S.add(getDirectoryLength(nextDir)(cr))(total))(
    0
  )(passedDirs);
const getTotalImagesCount = getTotalImagesFromDir(dirs);
const countToMsg = count => ({ msg: String(count) });
const getCurrentObj = cr => ({ ID: cr.msg });
const addToErrorMessage = errorMessage => oldMessage =>
  `${oldMessage} :-: ${errorMessage}`;

const getFileUploadCountForRep = S.pipe([
  S.tagBy(S.is(SD.Object)),
  S.either(addToErrorMessage("parameter is not an object 1"))(getCurrentObj),
  S.tagBy(S.is(SD.Object)),
  S.either(x => x)(getTotalImagesCount),
  S.tagBy(x => !!(x > 0)),
  S.either(addToErrorMessage("parameter is less than 1"))(countToMsg),
  consoleIdentity,
  S.tagBy(S.is(SD.Object)),
  S.either(x => 0)(x => x),
  S.tagBy(x => !!(x.msg > 0)),
  S.Just
]);

class App extends React.Component {
  state = {};
  makeButton = label => status => (
    <button
      style={{ marginRight: 10 }}
      onClick={() => this.setState({ status })}
    >
      {label}
    </button>
  );

  render() {
    const { status } = this.state;

    return (
      <div className="App">
        <h1>Sanctuary Demo</h1>
        {this.makeButton("Loading")(S.Nothing)}
        <br />
        <br />
        {this.makeButton("Error")(S.Just(S.Left("bad!")))}
        {this.makeButton("Error2")(getFileUploadCountForRep(null))}
        {this.makeButton("Error3")(getFileUploadCountForRep(S.Nothing))}
        {this.makeButton("Error4")(
          getFileUploadCountForRep({ message: "myID3" })
        )}
        {this.makeButton("Error5")(getFileUploadCountForRep({}))}
        <br />
        <br />
        {this.makeButton("Success")(S.Just(S.Right({ msg: "good!" })))}
        {this.makeButton("Success2")(
          getFileUploadCountForRep({ msg: "myID3" })
        )}
        <h2>Click a button to see some magic happen!</h2>
        {status &&
          S.maybe_(() => <LoadingView />)(
            S.either(error => <ErrorView error={error} />)(data => (
              <SuccessView data={data} />
            ))
          )(status)}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
