import { ZodError } from "zod";

interface TErrorDetails {
  issues: { path: string; message: string }[];
}

interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorDetails: TErrorDetails;
}

function formatZodMessage(field: string | number, rawMessage: string): string {
  const readableField =
    typeof field === "string" ? field.charAt(0).toUpperCase() + field.slice(1) : "A required field";

  if (rawMessage.includes("Required")) {
    if (readableField.toLowerCase() === "body") return "No data provided in the request body.";
    return `${readableField} is required.`;
  }
  if (rawMessage.includes("Invalid email")) return `${readableField} is not a valid email address.`;
  if (rawMessage.includes("Expected number")) return `${readableField} must be a number.`;
  if (rawMessage.includes("Expected string")) return `${readableField} must be text.`;

  const minMatch = rawMessage.match(/at least (\d+) character/);
  if (minMatch) return `${readableField} must be at least ${minMatch[1]} characters long.`;

  const maxMatch = rawMessage.match(/at most (\d+) character/);
  if (maxMatch) return `${readableField} cannot exceed ${maxMatch[1]} characters.`;

  if (rawMessage.includes("Unrecognized key(s)")) {
    const keyMatch = rawMessage.match(/Unrecognized key\(s\) in object: (.*)\./);
    if (keyMatch && keyMatch[1]) {
      const keys = keyMatch[1].replace(/'/g, "").trim();
      if (["body", "query", "params"].includes(readableField.toLowerCase())) {
        return `Extra field(s) (${keys}) are not allowed in the ${readableField}.`;
      }
      return `The extra field(s) (${keys}) are not allowed.`;
    }
  }

  if (rawMessage.includes("Invalid") || rawMessage.includes("Expected")) {
    return `${readableField} has an invalid value or incorrect format.`;
  }

  return `${readableField}: ${rawMessage}`;
}

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const issues = err.issues.map((issue) => {
    const specificPath = issue.path.join(".");
    const field = issue.path[issue.path.length - 1] as string;
    return {
      path: specificPath,
      message: formatZodMessage(field, issue.message),
    };
  });

  let summary: string;
  if (issues.length === 0) summary = "Validation failed due to an unexpected error.";
  else if (issues.length === 1) summary = issues[0].message;
  else summary = `Found ${issues.length} input errors. Please review your form input.`;

  return {
    statusCode: 400,
    message: summary,
    errorDetails: { issues },
  };
};

export default handleZodError;
