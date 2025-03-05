import axios from 'axios';

export async function getHtmlByAxios(url: string) {
  const { data: html } = await axios.get(url);
  return html;
}
