import { render } from "@testing-library/react";
import MyComponent from "../src/MyComponent";

test("renders correctly", () => {
  const { getByText } = render(<MyComponent />);
  expect(getByText("Hello, world!")).toBeInTheDocument();
});
