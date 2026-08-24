import { useState, useCallback } from "react";
import { Delete } from "lucide-react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = useCallback((num: string) => {
    setDisplay((prev) => {
      if (newNumber) {
        setNewNumber(false);
        return num;
      }
      return prev === "0" ? num : prev + num;
    });
  }, [newNumber]);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => {
      if (newNumber) {
        setNewNumber(false);
        return "0.";
      }
      return prev.includes(".") ? prev : prev + ".";
    });
  }, [newNumber]);

  const handleOperation = useCallback((op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !newNumber) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setNewNumber(true);
  }, [display, previousValue, operation, newNumber]);

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return prev / current;
      case "%":
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = useCallback(() => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  }, [display, previousValue, operation]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length === 1) return "0";
      return prev.slice(0, -1);
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setDisplay((prev) => {
      const num = parseFloat(prev);
      return String(num * -1);
    });
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay((prev) => {
      const num = parseFloat(prev);
      return String(num / 100);
    });
  }, []);

  const Button = ({ 
    onClick, 
    children, 
    variant = "default",
    className = ""
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    variant?: "default" | "operation" | "equals" | "function";
    className?: string;
  }) => {
    const baseStyle = "h-16 rounded-xl font-semibold text-lg transition-all active:scale-95";
    const variants = {
      default: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      operation: "bg-accent text-accent-foreground hover:bg-accent/90",
      equals: "bg-primary text-primary-foreground hover:bg-primary/90 col-span-2",
      function: "bg-muted text-muted-foreground hover:bg-muted/90",
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl shadow-2xl p-6 space-y-4">
          {/* Display */}
          <div className="bg-secondary rounded-xl p-6 text-right">
            <div className="text-sm text-muted-foreground mb-2">
              {previousValue !== null && operation 
                ? `${previousValue} ${operation}` 
                : ""}
            </div>
            <div className="text-5xl font-bold text-secondary-foreground break-words">
              {display}
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button onClick={handleClear} variant="function">
              AC
            </Button>
            <Button onClick={handleToggleSign} variant="function">
              +/−
            </Button>
            <Button onClick={handlePercent} variant="function">
              %
            </Button>
            <Button onClick={() => handleOperation("÷")} variant="operation">
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => handleNumber("7")} variant="default">
              7
            </Button>
            <Button onClick={() => handleNumber("8")} variant="default">
              8
            </Button>
            <Button onClick={() => handleNumber("9")} variant="default">
              9
            </Button>
            <Button onClick={() => handleOperation("×")} variant="operation">
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => handleNumber("4")} variant="default">
              4
            </Button>
            <Button onClick={() => handleNumber("5")} variant="default">
              5
            </Button>
            <Button onClick={() => handleNumber("6")} variant="default">
              6
            </Button>
            <Button onClick={() => handleOperation("-")} variant="operation">
              −
            </Button>

            {/* Row 4 */}
            <Button onClick={() => handleNumber("1")} variant="default">
              1
            </Button>
            <Button onClick={() => handleNumber("2")} variant="default">
              2
            </Button>
            <Button onClick={() => handleNumber("3")} variant="default">
              3
            </Button>
            <Button onClick={() => handleOperation("+")} variant="operation">
              +
            </Button>

            {/* Row 5 */}
            <Button 
              onClick={() => handleNumber("0")} 
              variant="default"
              className="col-span-2"
            >
              0
            </Button>
            <Button onClick={handleDecimal} variant="default">
              .
            </Button>
            <Button 
              onClick={handleBackspace} 
              variant="function"
              className="flex items-center justify-center"
            >
              <Delete size={20} />
            </Button>

            {/* Row 6 */}
            <Button onClick={handleEquals} variant="equals">
              =
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Calculator App</p>
        </div>
      </div>
    </div>
  );
}
