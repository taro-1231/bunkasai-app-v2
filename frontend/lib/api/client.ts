
// process.env.環境変数　で環境変数を取得
// ??はnullやundefinedの場合のデフォルト値
//opts:Options = {} は optsが渡されないときに{}をデフォルト値として使う

// <T>は戻り値の型の指定だが、いったん何が来てもOKというもの。
// 何が返ってくるかわからない時や返ってくるJSONが大きい時は書ききれないから<T>とする。
//promise<T>は非同期処理で、呼び出しもとで指定されたTの型で返すことを約束する。

//リクエストはHTTPメソッド,URL,headers,bodyをもつ
//ヘッダーはContent-Type（データの種類: JSON, form-data, etc.）、Authorization（認証トークン）、Accept（受け入れられるレスポンスの形式）
// ボディはJSONやFormData


//Optionsはいったん？で継承先で選択する

export class ApiError extends Error {
    constructor(public status: number, public body: unknown) {
      super(`API ${status}`);
    }
  }
  

  // /api/v2/tenants/{slug}/boothsとか
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api/tenants";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/v2/tenants";


type Options = {
    auth?: boolean;                 // 認証ヘッダーを付けるか（必要に応じて実装）
    cache?: RequestCache | "no-store";
    headers?: HeadersInit;
    body?: BodyInit | null;
    method?: string;
  };

export async function apiFetch<T = unknown>(path: string, opts: Options = {}) {
  const headers = new Headers(opts.headers);

      // JSONをデフォルトに（FormDataのときは自動で外す）
      // JSONのときはレスポンス(Accept)をJSONにして、
      //GETのときはbodyないのでContent-Typeはいらない、POSTのときはContent-TypeをJSONにする
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  if (!isForm) {
    headers.set("Accept", "application/json");
    if (opts.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // 認証トークンの付与（例：localStorage や Cookie から取り出す仕様に合わせて実装）
  // if (opts.auth && !headers.has("Authorization")) {
  //   const token = getTokenSomehow();
  //   if (token) headers.set("Authorization", `Bearer ${token}`);
  // }

  // 指定したオプションでAPIを呼び出す
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers,
    body: opts.body,
    cache: opts.cache ?? "no-store",
    credentials: "same-origin", // 同一オリジン（rewrite経由）ならCookie送受信OK
  });
  //apiの戻り値であるレスポンスオブジェクトをでcontent-typeがJSONならjson()でパースし、それ以外はtext()でテキストにする
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text();

  //apiの戻り値であるレスポンスオブジェクトのstatusが400以上ならApiErrorをthrow
  if (!res.ok) throw new ApiError(res.status, body);

  // 呼び出し元の<T>の型で返す
  return body as T;
}

export function getTenantFromBrowser(): string | null { 
  if (typeof window === "undefined") 
    return null; 
  const { hostname, pathname } = window.location; 
  // パス: /v1/tenants/foo/... → "foo" 
  const m = pathname.match(/\/tenants\/([^/]+)/); 
  return m ? m[1] : null; }