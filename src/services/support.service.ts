export async function getTokenSupport(): Promise<string> {
  /* const { data } = await api.get('/token-support')
  return data */

  await new Promise((res) => setTimeout(() => res(''), 2000))

  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJwbGF0Zm9ybSI6ImFwcEEiLCJuYW1lIjoiU2FtdWVsIDIgYXNkYXNkIiwiaWF0IjoxNjk0Mjg0ODAwLCJleHAiOjE2OTQyODg0MDB9.mHTs2cjkPTa6scGAaCLqJJPfDG6ut1i9XKKTJ7vODLc'
}
