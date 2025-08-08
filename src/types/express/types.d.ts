declare namespace Express {
  export interface Request {
    userId: string;
    validatedData: any;
  }
}
