export interface JwtTokenPayload {
  userId: string;
  tokenId?: string;
  iss: string;
  sub: string;
}
