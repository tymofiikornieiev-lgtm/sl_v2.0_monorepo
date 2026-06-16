import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Role = "admin" | "manager" | "viewer";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  token: string;
  refreshToken?: string;
  user: User;
};

type Make = { id: number; name: string };
type Model = { id: number; name: string; makeId: number; make?: Make };
type KeyType = { id: number; name: string };
type IgnitionType = { id: number; name: string };
type Dealer = { id: number; name: string; phone?: string; address?: string };
type VehicleConfiguration = {
  id: number;
  year: number;
  makeId: number;
  modelId: number;
  ignitionTypeId: number;
  keyTypeId: number;
  buttonsCount: number;
  make?: Make;
  model?: Model;
  keyType?: KeyType;
  ignitionType?: IgnitionType;
};
type CurrentPrice = {
  id: number;
  vehicleConfigurationId: number;
  dealerId?: number;
  priceSecureLocksAKL?: string;
  priceSecureLocksAddKey?: string;
  priceSecureLocksProgramOnly?: string;
  priceSecureLocksParts?: string;
  priceDealerTransmitter?: string;
  priceDealerBlade?: string;
  priceDealerProgram?: string;
  vin?: string;
  partNumber?: string;
  link?: string;
  dateCalled?: string;
  comments?: string;
  createdByUserId?: number;
  updatedByUserId?: number;
  createdAt: string;
  updatedAt: string;
  vehicleConfiguration?: VehicleConfiguration & {
    make?: Make;
    model?: Model;
    keyType?: KeyType;
    ignitionType?: IgnitionType;
  };
  dealer?: Dealer;
};

type TabKey =
  | "users"
  | "makes-models"
  | "key-ignition"
  | "dealers"
  | "dealer-prices"
  | "prices";

const API_BASE = import.meta.env.VITE_API_BASE?.trim();
// const API_BASE =
//   import.meta.env.VITE_API_BASE?.trim() || "http://localhost:3003/api";

console.log("API_BASE", API_BASE);
const STORAGE_KEY = "sl-auth";

function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      return null;
    }
  });

  const [tab, setTab] = useState<TabKey>(() => {
    if (!auth) return "users";
    if (auth.user.role === "admin") return "users";
    if (auth.user.role === "viewer") return "prices";
    return "makes-models";
  });
  const [notice, setNotice] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const role = auth?.user.role;
  const isViewer = role === "viewer";
  const canManageUsers = role === "admin";
  const canWrite = role === "admin" || role === "manager";

  const http = useMemo(() => {
    return async <T,>(path: string, init?: RequestInit): Promise<T> => {
      setError("");

      const headers = new Headers(init?.headers || {});
      headers.set("Content-Type", "application/json");
      if (auth?.token) {
        headers.set("Authorization", `Bearer ${auth.token}`);
      }

      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers,
      });

      if (!res.ok) {
        let message = `${res.status} ${res.statusText}`;
        try {
          const data = (await res.json()) as { message?: string | string[] };
          if (Array.isArray(data.message)) {
            message = data.message.join("; ");
          } else if (typeof data.message === "string") {
            message = data.message;
          }
        } catch {
          // Keep fallback message.
        }

        throw new Error(message);
      }

      if (res.status === 204) {
        return undefined as T;
      }

      return (await res.json()) as T;
    };
  }, [auth?.token]);

  const onAuth = (nextAuth: AuthState) => {
    setAuth(nextAuth);
    setNotice(`Welcome, ${nextAuth.user.firstName}`);
    setTab(
      nextAuth.user.role === "admin"
        ? "users"
        : nextAuth.user.role === "viewer"
          ? "prices"
          : "makes-models",
    );
  };

  const logout = () => {
    setAuth(null);
    setTab("users");
    setNotice("Session closed");
  };

  if (!auth) {
    return (
      <AuthScreen
        onAuth={onAuth}
        http={http}
        error={error}
        setError={setError}
      />
    );
  }

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <div>
          <p className='eyebrow'>Secure Locks</p>
          <h1>Operations Console</h1>
        </div>
        <div className='topbar-right'>
          <span className={`pill role-${role}`}>{role}</span>
          <button className='btn btn-ghost' onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav className='tabbar' aria-label='Sections'>
        {canManageUsers && (
          <button
            className={tab === "users" ? "tab active" : "tab"}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        )}
        {!isViewer && (
          <>
            <button
              className={tab === "makes-models" ? "tab active" : "tab"}
              onClick={() => setTab("makes-models")}
            >
              Makes & Models
            </button>
            <button
              className={tab === "key-ignition" ? "tab active" : "tab"}
              onClick={() => setTab("key-ignition")}
            >
              Keys & Ignition
            </button>
            <button
              className={tab === "dealers" ? "tab active" : "tab"}
              onClick={() => setTab("dealers")}
            >
              Dealers
            </button>
            <button
              className={tab === "dealer-prices" ? "tab active" : "tab"}
              onClick={() => setTab("dealer-prices")}
            >
              Dealer Prices
            </button>
          </>
        )}
        <button
          className={tab === "prices" ? "tab active" : "tab"}
          onClick={() => setTab("prices")}
        >
          Key Search
        </button>
      </nav>

      {notice && <p className='notice'>{notice}</p>}
      {error && <p className='error'>{error}</p>}

      <main className='page-content'>
        {tab === "users" && canManageUsers && (
          <UsersRolePage
            http={http}
            onError={setError}
            onSuccess={setNotice}
            currentUserId={auth.user.id}
          />
        )}

        {tab === "makes-models" && (
          <MakesModelsPage
            http={http}
            canWrite={canWrite}
            onError={setError}
            onSuccess={setNotice}
          />
        )}

        {tab === "key-ignition" && (
          <KeyIgnitionPage
            http={http}
            canWrite={canWrite}
            onError={setError}
            onSuccess={setNotice}
          />
        )}

        {tab === "dealers" && (
          <DealersPage
            http={http}
            canWrite={canWrite}
            onError={setError}
            onSuccess={setNotice}
          />
        )}

        {tab === "dealer-prices" && canWrite && (
          <DealerPricesPage
            http={http}
            onError={setError}
            onSuccess={setNotice}
          />
        )}

        {tab === "prices" && (
          <SearchKeysPage
            http={http}
            canWrite={canWrite}
            currentUserId={auth.user.id}
            onError={setError}
            onSuccess={setNotice}
          />
        )}
      </main>
    </div>
  );
}

function AuthScreen({
  onAuth,
  http,
  error,
  setError,
}: {
  onAuth: (auth: AuthState) => void;
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  error: string;
  setError: (v: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const data = await http<{
          user: User;
          token: { token: string; refreshToken: string };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        onAuth({
          user: data.user,
          token: data.token.token,
          refreshToken: data.token.refreshToken,
        });
      } else {
        const data = await http<{
          user: User;
          token: { token: string; refreshToken: string };
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            password,
            passwordConfirmation,
          }),
        });

        onAuth({
          user: data.user,
          token: data.token.token,
          refreshToken: data.token.refreshToken,
        });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-wrap'>
      <section className='auth-card'>
        <p className='eyebrow'>Secure Locks</p>
        <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
        <p className='muted'>
          Mobile-first control panel for makes, dealers, prices and role-driven
          access.
        </p>

        <div className='switch-row'>
          <button
            className={mode === "login" ? "switch active" : "switch"}
            onClick={() => setMode("login")}
            type='button'
          >
            Login
          </button>
          <button
            className={mode === "register" ? "switch active" : "switch"}
            onClick={() => setMode("register")}
            type='button'
          >
            Register
          </button>
        </div>

        <form className='form-grid' onSubmit={submit}>
          <label>
            Email
            <input
              required
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {mode === "register" && (
            <>
              <label>
                First name
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last name
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </>
          )}

          <label>
            Password
            <input
              required
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === "register" && (
            <label>
              Confirm password
              <input
                required
                type='password'
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </label>
          )}

          {error && <p className='error'>{error}</p>}
          <button className='btn' disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
}

function UsersRolePage({
  http,
  onError,
  onSuccess,
  currentUserId,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
  currentUserId: number;
}) {
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    try {
      const data = await http<User[]>("/users");
      setUsers(data);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateRole = async (userId: number, role: Role) => {
    try {
      await http(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      onSuccess("User role updated");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  return (
    <section className='panel'>
      <h2>User Access Management</h2>
      <p className='muted'>Only admin can edit roles.</p>

      <div className='list'>
        {users.map((user) => (
          <article className='row-card' key={user.id}>
            <div>
              <strong>
                {user.firstName} {user.lastName || ""}
              </strong>
              <p>{user.email}</p>
            </div>

            <select
              value={user.role}
              onChange={(e) => void updateRole(user.id, e.target.value as Role)}
              disabled={currentUserId === user.id}
            >
              <option value='admin'>admin</option>
              <option value='manager'>manager</option>
              <option value='viewer'>viewer</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}

function MakesModelsPage({
  http,
  canWrite,
  onError,
  onSuccess,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  canWrite: boolean;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
}) {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelMakeId, setModelMakeId] = useState<number | "">("");

  const [editingMake, setEditingMake] = useState<Record<number, string>>({});
  const [editingModel, setEditingModel] = useState<
    Record<number, { name: string; makeId: number }>
  >({});

  const load = async () => {
    try {
      const [nextMakes, nextModels] = await Promise.all([
        http<Make[]>("/makes"),
        http<Model[]>("/models"),
      ]);
      setMakes(nextMakes);
      setModels(nextModels);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createMake = async (e: FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;

    try {
      await http("/makes", {
        method: "POST",
        body: JSON.stringify({ name: makeName }),
      });
      setMakeName("");
      onSuccess("Make added");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const createModel = async (e: FormEvent) => {
    e.preventDefault();
    if (!canWrite || modelMakeId === "") return;

    try {
      await http("/models", {
        method: "POST",
        body: JSON.stringify({ name: modelName, makeId: modelMakeId }),
      });
      setModelName("");
      setModelMakeId("");
      onSuccess("Model added");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  return (
    <section className='panel-grid'>
      <article className='panel'>
        <h2>Makes</h2>
        {canWrite && (
          <form className='inline-form' onSubmit={createMake}>
            <input
              value={makeName}
              onChange={(e) => setMakeName(e.target.value)}
              placeholder='Toyota'
              required
            />
            <button className='btn'>Add</button>
          </form>
        )}

        <div className='list'>
          {makes.map((make) => (
            <article key={make.id} className='row-card'>
              {canWrite ? (
                <input
                  value={editingMake[make.id] ?? make.name}
                  onChange={(e) =>
                    setEditingMake((prev) => ({
                      ...prev,
                      [make.id]: e.target.value,
                    }))
                  }
                />
              ) : (
                <strong>{make.name}</strong>
              )}

              {canWrite && (
                <div className='actions'>
                  <button
                    className='btn btn-ghost'
                    onClick={() =>
                      void http(`/makes/${make.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          name: editingMake[make.id] ?? make.name,
                        }),
                      })
                        .then(() => {
                          onSuccess("Make updated");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Save
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      void http(`/makes/${make.id}`, { method: "DELETE" })
                        .then(() => {
                          onSuccess("Make deleted");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </article>

      <article className='panel'>
        <h2>Models</h2>
        {canWrite && (
          <form className='inline-form' onSubmit={createModel}>
            <input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder='Camry'
              required
            />
            <select
              required
              value={modelMakeId}
              onChange={(e) => setModelMakeId(Number(e.target.value) || "")}
            >
              <option value=''>Make</option>
              {makes.map((make) => (
                <option value={make.id} key={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
            <button className='btn'>Add</button>
          </form>
        )}

        <div className='list'>
          {models.map((model) => (
            <article key={model.id} className='row-card stacked'>
              {canWrite ? (
                <>
                  <input
                    value={editingModel[model.id]?.name ?? model.name}
                    onChange={(e) =>
                      setEditingModel((prev) => ({
                        ...prev,
                        [model.id]: {
                          name: e.target.value,
                          makeId: prev[model.id]?.makeId ?? model.makeId,
                        },
                      }))
                    }
                  />
                  <select
                    value={editingModel[model.id]?.makeId ?? model.makeId}
                    onChange={(e) =>
                      setEditingModel((prev) => ({
                        ...prev,
                        [model.id]: {
                          name: prev[model.id]?.name ?? model.name,
                          makeId: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    {makes.map((make) => (
                      <option value={make.id} key={make.id}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <strong>{model.name}</strong>
                  <p>{model.make?.name || `Make #${model.makeId}`}</p>
                </>
              )}

              {canWrite && (
                <div className='actions'>
                  <button
                    className='btn btn-ghost'
                    onClick={() =>
                      void http(`/models/${model.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          name: editingModel[model.id]?.name ?? model.name,
                          makeId:
                            editingModel[model.id]?.makeId ?? model.makeId,
                        }),
                      })
                        .then(() => {
                          onSuccess("Model updated");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Save
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      void http(`/models/${model.id}`, { method: "DELETE" })
                        .then(() => {
                          onSuccess("Model deleted");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function KeyIgnitionPage({
  http,
  canWrite,
  onError,
  onSuccess,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  canWrite: boolean;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
}) {
  const [keyTypes, setKeyTypes] = useState<KeyType[]>([]);
  const [ignitionTypes, setIgnitionTypes] = useState<IgnitionType[]>([]);
  const [keyName, setKeyName] = useState("");
  const [ignitionName, setIgnitionName] = useState("");

  const load = async () => {
    try {
      const [keys, ignitions] = await Promise.all([
        http<KeyType[]>("/key-types"),
        http<IgnitionType[]>("/ignition-types"),
      ]);
      setKeyTypes(keys);
      setIgnitionTypes(ignitions);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    try {
      await http("/key-types", {
        method: "POST",
        body: JSON.stringify({ name: keyName }),
      });
      setKeyName("");
      onSuccess("Key type added");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const createIgnition = async (e: FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    try {
      await http("/ignition-types", {
        method: "POST",
        body: JSON.stringify({ name: ignitionName }),
      });
      setIgnitionName("");
      onSuccess("Ignition type added");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  return (
    <section className='panel-grid'>
      <article className='panel'>
        <h2>Key Types</h2>
        {canWrite && (
          <form className='inline-form' onSubmit={createKey}>
            <input
              required
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder='Smart key'
            />
            <button className='btn'>Add</button>
          </form>
        )}
        <div className='list'>
          {keyTypes.map((item) => (
            <article className='row-card' key={item.id}>
              <strong>{item.name}</strong>
              {canWrite && (
                <div className='actions'>
                  <button
                    className='btn btn-ghost'
                    onClick={() => {
                      const nextName = window.prompt(
                        "Key type name",
                        item.name,
                      );
                      if (!nextName) return;

                      void http(`/key-types/${item.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ name: nextName }),
                      })
                        .then(() => {
                          onSuccess("Key type updated");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message));
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      void http(`/key-types/${item.id}`, { method: "DELETE" })
                        .then(() => {
                          onSuccess("Key type deleted");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </article>

      <article className='panel'>
        <h2>Ignition Types</h2>
        {canWrite && (
          <form className='inline-form' onSubmit={createIgnition}>
            <input
              required
              value={ignitionName}
              onChange={(e) => setIgnitionName(e.target.value)}
              placeholder='Push Start'
            />
            <button className='btn'>Add</button>
          </form>
        )}
        <div className='list'>
          {ignitionTypes.map((item) => (
            <article className='row-card' key={item.id}>
              <strong>{item.name}</strong>
              {canWrite && (
                <div className='actions'>
                  <button
                    className='btn btn-ghost'
                    onClick={() => {
                      const nextName = window.prompt(
                        "Ignition type name",
                        item.name,
                      );
                      if (!nextName) return;

                      void http(`/ignition-types/${item.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ name: nextName }),
                      })
                        .then(() => {
                          onSuccess("Ignition type updated");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message));
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      void http(`/ignition-types/${item.id}`, {
                        method: "DELETE",
                      })
                        .then(() => {
                          onSuccess("Ignition type deleted");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function DealersPage({
  http,
  canWrite,
  onError,
  onSuccess,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  canWrite: boolean;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
}) {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dealerFilter, setDealerFilter] = useState("");
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [savingDealer, setSavingDealer] = useState(false);

  const load = async () => {
    try {
      setDealers(await http<Dealer[]>("/dealers"));
    } catch (err) {
      onError((err as Error).message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;

    try {
      await http("/dealers", {
        method: "POST",
        body: JSON.stringify({ name, phone, address }),
      });
      setName("");
      setPhone("");
      setAddress("");
      onSuccess("Dealer added");
      await load();
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const openEditDealer = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setEditName(dealer.name);
    setEditPhone(dealer.phone ?? "");
    setEditAddress(dealer.address ?? "");
  };

  const closeEditDealer = () => {
    setEditingDealer(null);
    setEditName("");
    setEditPhone("");
    setEditAddress("");
    setSavingDealer(false);
  };

  const saveDealer = async () => {
    if (!editingDealer || !canWrite) return;
    if (!editName.trim()) {
      onError("Dealer name is required");
      return;
    }

    setSavingDealer(true);
    try {
      await http(`/dealers/${editingDealer.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim() || undefined,
          address: editAddress.trim() || undefined,
        }),
      });
      onSuccess("Dealer updated");
      await load();
      closeEditDealer();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setSavingDealer(false);
    }
  };

  return (
    <section className='panel'>
      <h2>Dealers</h2>
      <div className='inline-form mobile-grid'>
        <input
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          placeholder='Filter by dealer name'
        />
        <div />
      </div>
      {canWrite && (
        <form className='inline-form mobile-grid' onSubmit={create}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Dealer name'
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Phone'
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Address'
          />
          <button className='btn'>Add dealer</button>
        </form>
      )}

      <div className='list'>
        {dealers
          .filter((dealer) =>
            dealer.name
              .toLowerCase()
              .includes(dealerFilter.trim().toLowerCase()),
          )
          .map((dealer) => (
            <article className='row-card stacked' key={dealer.id}>
              <strong>{dealer.name}</strong>
              <p>{dealer.phone || "No phone"}</p>
              <p>{dealer.address || "No address"}</p>
              {canWrite && (
                <div className='actions'>
                  <button
                    className='btn btn-ghost'
                    type='button'
                    onClick={() => openEditDealer(dealer)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      void http(`/dealers/${dealer.id}`, { method: "DELETE" })
                        .then(() => {
                          onSuccess("Dealer deleted");
                          return load();
                        })
                        .catch((err: Error) => onError(err.message))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
      </div>

      {editingDealer && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3>Edit dealer</h3>
            <div className='stack gap-12'>
              <label>
                Name
                <input
                  type='text'
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  type='text'
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </label>

              <label>
                Address
                <input
                  type='text'
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
              </label>

              <div className='actions'>
                <button
                  className='btn btn-ghost'
                  type='button'
                  onClick={closeEditDealer}
                >
                  Cancel
                </button>
                <button
                  className='btn'
                  type='button'
                  onClick={saveDealer}
                  disabled={savingDealer}
                >
                  {savingDealer ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DealerPricesPage({
  http,
  onError,
  onSuccess,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
}) {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<number | "">("");
  const [prices, setPrices] = useState<CurrentPrice[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDealers = async () => {
    try {
      setDealers(await http<Dealer[]>("/dealers"));
      onSuccess("Dealers loaded");
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const loadPrices = async (dealerId: number | "") => {
    if (!dealerId) {
      setPrices([]);
      return;
    }

    setLoading(true);
    try {
      const data = await http<CurrentPrice[]>(
        `/current-prices?dealerId=${dealerId}`,
      );
      setPrices(data);
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDealers();
  }, []);

  useEffect(() => {
    void loadPrices(selectedDealerId);
  }, [selectedDealerId]);

  return (
    <section className='panel'>
      <h2>Dealer Prices</h2>
      <p className='muted'>Only admin and manager can view prices by dealer.</p>

      <form className='inline-form mobile-grid'>
        <select
          value={selectedDealerId}
          onChange={(e) => {
            const next = e.target.value ? Number(e.target.value) : "";
            setSelectedDealerId(next);
          }}
        >
          <option value=''>Select dealer</option>
          {dealers.map((dealer) => (
            <option key={dealer.id} value={dealer.id}>
              {dealer.name}
            </option>
          ))}
        </select>
      </form>

      {selectedDealerId === "" ? (
        <p className='muted'>Select a dealer to view linked current prices.</p>
      ) : loading ? (
        <p className='muted'>Loading prices...</p>
      ) : (
        <div className='list'>
          {prices.map((price) => (
            <article className='row-card stacked' key={price.id}>
              <strong>Price #{price.id}</strong>
              <p>
                {price.vehicleConfiguration ? (
                  <>
                    {price.vehicleConfiguration.year}{" "}
                    {price.vehicleConfiguration.make?.name ||
                      `Make ${price.vehicleConfiguration.makeId}`}{" "}
                    {price.vehicleConfiguration.model?.name ||
                      `Model ${price.vehicleConfiguration.modelId}`}{" "}
                    |{" "}
                    {price.vehicleConfiguration.keyType?.name ||
                      `Key ${price.vehicleConfiguration.keyTypeId}`}{" "}
                    /{" "}
                    {price.vehicleConfiguration.ignitionType?.name ||
                      `Ignition ${price.vehicleConfiguration.ignitionTypeId}`}{" "}
                    | buttons {price.vehicleConfiguration.buttonsCount}
                  </>
                ) : (
                  `VC #${price.vehicleConfigurationId}`
                )}
              </p>
              <p>
                Dealer:{" "}
                {price.dealer?.name ??
                  (price.dealerId ? `#${price.dealerId}` : "No dealer")}
              </p>
              <p>
                AKL: {price.priceSecureLocksAKL || "-"} | Add Key:{" "}
                {price.priceSecureLocksAddKey || "-"}
              </p>
              <p>SL Program: {price.priceSecureLocksProgramOnly || "-"}</p>
              <p>
                Dealer transmitter: {price.priceDealerTransmitter || "-"} |
                Dealer blade: {price.priceDealerBlade || "-"}
              </p>
              <p>
                VIN: {price.vin || "-"} | Part #: {price.partNumber || "-"}
              </p>
              <p>Called: {price.dateCalled || "-"}</p>
              <p>Link: {price.link || "-"}</p>
              <p>{price.comments || "No comments"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SearchKeysPage({
  http,
  canWrite,
  currentUserId,
  onError,
  onSuccess,
}: {
  http: <T>(path: string, init?: RequestInit) => Promise<T>;
  canWrite: boolean;
  currentUserId: number;
  onError: (v: string) => void;
  onSuccess: (v: string) => void;
}) {
  const [prices, setPrices] = useState<CurrentPrice[]>([]);
  const [vehicleConfigurations, setVehicleConfigurations] = useState<
    VehicleConfiguration[]
  >([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [keyTypes, setKeyTypes] = useState<KeyType[]>([]);
  const [ignitionTypes, setIgnitionTypes] = useState<IgnitionType[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [searchMatrix, setSearchMatrix] = useState<
    Array<{
      year: number;
      make: string;
      model: string;
      typeOfKey: string;
      typeOfIgnition: string;
    }>
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  type PriceForm = {
    id?: number;
    year: string;
    makeId: string;
    modelId: string;
    keyTypeId: string;
    ignitionTypeId: string;
    buttonsCount: string;
    dealerId: string;
    dealerName: string;
    dealerPhone: string;
    dealerAddress: string;
    priceSecureLocksAKL: string;
    priceSecureLocksAddKey: string;
    priceSecureLocksProgramOnly: string;
    priceSecureLocksParts: string;
    priceDealerTransmitter: string;
    priceDealerBlade: string;
    priceDealerProgram: string;
    vin: string;
    partNumber: string;
    dateCalled: string;
    link: string;
    comments: string;
  };

  const blankForm: PriceForm = {
    year: "",
    makeId: "",
    modelId: "",
    keyTypeId: "",
    ignitionTypeId: "",
    buttonsCount: "0",
    dealerId: "",
    dealerName: "",
    dealerPhone: "",
    dealerAddress: "",
    priceSecureLocksAKL: "",
    priceSecureLocksAddKey: "",
    priceSecureLocksProgramOnly: "",
    priceSecureLocksParts: "",
    priceDealerTransmitter: "",
    priceDealerBlade: "",
    priceDealerProgram: "",
    vin: "",
    partNumber: "",
    dateCalled: "",
    link: "",
    comments: "",
  };

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | "copy">(
    "create",
  );
  const [form, setForm] = useState<PriceForm>(blankForm);
  const [deleting, setDeleting] = useState<CurrentPrice | null>(null);

  const [searchFilters, setSearchFilters] = useState({
    year: "",
    make: "",
    model: "",
    typeOfKey: "",
    typeOfIgnition: "",
  });
  const currentYear = new Date().getFullYear();

  const loadSelectors = async () => {
    try {
      const [
        searchMatrixData,
        vcData,
        makesData,
        modelsData,
        keyTypesData,
        ignitionData,
        dealersData,
      ] = await Promise.all([
        http<
          Array<{
            year: number;
            make: string;
            model: string;
            typeOfKey: string;
            typeOfIgnition: string;
          }>
        >("/current-prices/filter-options"),
        http<VehicleConfiguration[]>("/vehicle-configurations"),
        http<Make[]>("/makes"),
        http<Model[]>("/models"),
        http<KeyType[]>("/key-types"),
        http<IgnitionType[]>("/ignition-types"),
        http<Dealer[]>("/dealers"),
      ]);

      setSearchMatrix(searchMatrixData);
      setVehicleConfigurations(vcData);
      setMakes(makesData);
      setModels(modelsData);
      setKeyTypes(keyTypesData);
      setIgnitionTypes(ignitionData);
      setDealers(dealersData);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const loadPrices = async (
    filters: {
      year?: string;
      make?: string;
      model?: string;
      typeOfKey?: string;
      typeOfIgnition?: string;
    } = {},
  ) => {
    try {
      const searchQuery = new URLSearchParams();

      if (filters.year?.trim()) {
        searchQuery.set("year", filters.year.trim());
      }
      if (filters.make?.trim()) {
        searchQuery.set("make", filters.make.trim());
      }
      if (filters.model?.trim()) {
        searchQuery.set("model", filters.model.trim());
      }
      if (filters.typeOfKey?.trim()) {
        searchQuery.set("typeOfKey", filters.typeOfKey.trim());
      }
      if (filters.typeOfIgnition?.trim()) {
        searchQuery.set("typeOfIgnition", filters.typeOfIgnition.trim());
      }

      // const hasFilters = Object.values(filters).some((value) =>
      //   Boolean(value?.trim()),
      // );
      const filteredPath = `/current-prices${searchQuery.toString() ? `?${searchQuery}` : ""}`;
      const pricesData = await http<CurrentPrice[]>(filteredPath);

      setPrices(pricesData);
      setHasSearched(true);
    } catch (err) {
      onError((err as Error).message);
    }
  };

  useEffect(() => {
    void loadSelectors();
  }, []);

  const selectorVehicleConfigurations = useMemo(
    () =>
      searchMatrix.map((item, index) => ({
        id: -index - 1,
        year: item.year,
        makeId: 0,
        modelId: 0,
        ignitionTypeId: 0,
        keyTypeId: 0,
        buttonsCount: 0,
        make: { id: 0, name: item.make },
        model: { id: 0, name: item.model, makeId: 0 },
        keyType: { id: 0, name: item.typeOfKey },
        ignitionType: { id: 0, name: item.typeOfIgnition },
      })),
    [searchMatrix],
  );

  const availableYears = useMemo(() => {
    const years = selectorVehicleConfigurations
      .filter((vc) => vc.year <= currentYear)
      .filter((vc) => {
        if (searchFilters.make && vc.make?.name !== searchFilters.make) {
          return false;
        }
        if (searchFilters.model && vc.model?.name !== searchFilters.model) {
          return false;
        }
        if (
          searchFilters.typeOfKey &&
          vc.keyType?.name !== searchFilters.typeOfKey
        ) {
          return false;
        }
        if (
          searchFilters.typeOfIgnition &&
          vc.ignitionType?.name !== searchFilters.typeOfIgnition
        ) {
          return false;
        }
        return true;
      })
      .map((vc) => vc.year);

    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [
    selectorVehicleConfigurations,
    currentYear,
    searchFilters.make,
    searchFilters.model,
    searchFilters.typeOfKey,
    searchFilters.typeOfIgnition,
  ]);

  const availableMakes = useMemo(() => {
    const makes = selectorVehicleConfigurations
      .filter((vc) => {
        if (searchFilters.year && vc.year !== Number(searchFilters.year)) {
          return false;
        }
        if (searchFilters.model && vc.model?.name !== searchFilters.model) {
          return false;
        }
        if (
          searchFilters.typeOfKey &&
          vc.keyType?.name !== searchFilters.typeOfKey
        ) {
          return false;
        }
        if (
          searchFilters.typeOfIgnition &&
          vc.ignitionType?.name !== searchFilters.typeOfIgnition
        ) {
          return false;
        }
        return true;
      })
      .map((vc) => vc.make?.name)
      .filter(Boolean) as string[];

    return Array.from(new Set(makes)).sort();
  }, [
    selectorVehicleConfigurations,
    searchFilters.year,
    searchFilters.model,
    searchFilters.typeOfKey,
    searchFilters.typeOfIgnition,
  ]);

  const availableModels = useMemo(() => {
    const models = selectorVehicleConfigurations
      .filter((vc) => {
        if (searchFilters.year && vc.year !== Number(searchFilters.year)) {
          return false;
        }
        if (searchFilters.make && vc.make?.name !== searchFilters.make) {
          return false;
        }
        if (
          searchFilters.typeOfKey &&
          vc.keyType?.name !== searchFilters.typeOfKey
        ) {
          return false;
        }
        if (
          searchFilters.typeOfIgnition &&
          vc.ignitionType?.name !== searchFilters.typeOfIgnition
        ) {
          return false;
        }
        return true;
      })
      .map((vc) => vc.model?.name)
      .filter(Boolean) as string[];

    return Array.from(new Set(models)).sort();
  }, [
    selectorVehicleConfigurations,
    searchFilters.year,
    searchFilters.make,
    searchFilters.typeOfKey,
    searchFilters.typeOfIgnition,
  ]);

  const availableKeyTypes = useMemo(() => {
    const keyTypes = selectorVehicleConfigurations
      .filter((vc) => {
        if (searchFilters.year && vc.year !== Number(searchFilters.year)) {
          return false;
        }
        if (searchFilters.make && vc.make?.name !== searchFilters.make) {
          return false;
        }
        if (searchFilters.model && vc.model?.name !== searchFilters.model) {
          return false;
        }
        if (
          searchFilters.typeOfIgnition &&
          vc.ignitionType?.name !== searchFilters.typeOfIgnition
        ) {
          return false;
        }
        return true;
      })
      .map((vc) => vc.keyType?.name)
      .filter(Boolean) as string[];

    return Array.from(new Set(keyTypes)).sort();
  }, [
    selectorVehicleConfigurations,
    searchFilters.year,
    searchFilters.make,
    searchFilters.model,
    searchFilters.typeOfIgnition,
  ]);

  const availableIgnitionTypes = useMemo(() => {
    const list = selectorVehicleConfigurations
      .filter((vc) => {
        if (searchFilters.year && vc.year !== Number(searchFilters.year)) {
          return false;
        }
        if (searchFilters.make && vc.make?.name !== searchFilters.make) {
          return false;
        }
        if (searchFilters.model && vc.model?.name !== searchFilters.model) {
          return false;
        }
        if (
          searchFilters.typeOfKey &&
          vc.keyType?.name !== searchFilters.typeOfKey
        ) {
          return false;
        }
        return true;
      })
      .map((vc) => vc.ignitionType?.name)
      .filter(Boolean) as string[];

    return Array.from(new Set(list)).sort();
  }, [
    selectorVehicleConfigurations,
    searchFilters.year,
    searchFilters.make,
    searchFilters.model,
    searchFilters.typeOfKey,
  ]);

  useEffect(() => {
    if (
      searchFilters.year &&
      !availableYears.includes(Number(searchFilters.year))
    ) {
      setSearchFilters((prev) => ({ ...prev, year: "" }));
    }
  }, [availableYears, searchFilters.year]);

  useEffect(() => {
    if (searchFilters.make && !availableMakes.includes(searchFilters.make)) {
      setSearchFilters((prev) => ({ ...prev, make: "" }));
    }
  }, [availableMakes, searchFilters.make]);

  useEffect(() => {
    if (searchFilters.model && !availableModels.includes(searchFilters.model)) {
      setSearchFilters((prev) => ({ ...prev, model: "" }));
    }
  }, [availableModels, searchFilters.model]);

  useEffect(() => {
    if (
      searchFilters.typeOfKey &&
      !availableKeyTypes.includes(searchFilters.typeOfKey)
    ) {
      setSearchFilters((prev) => ({ ...prev, typeOfKey: "" }));
    }
  }, [availableKeyTypes, searchFilters.typeOfKey]);

  useEffect(() => {
    if (
      searchFilters.typeOfIgnition &&
      !availableIgnitionTypes.includes(searchFilters.typeOfIgnition)
    ) {
      setSearchFilters((prev) => ({ ...prev, typeOfIgnition: "" }));
    }
  }, [availableIgnitionTypes, searchFilters.typeOfIgnition]);

  const openCreate = () => {
    setEditorMode("create");
    setForm(blankForm);
    setEditorOpen(true);
  };

  const openEdit = (price: CurrentPrice) => {
    setEditorMode("edit");
    setForm({
      id: price.id,
      year: String(price.vehicleConfiguration?.year ?? ""),
      makeId: String(price.vehicleConfiguration?.makeId ?? ""),
      modelId: String(price.vehicleConfiguration?.modelId ?? ""),
      keyTypeId: String(price.vehicleConfiguration?.keyTypeId ?? ""),
      ignitionTypeId: String(price.vehicleConfiguration?.ignitionTypeId ?? ""),
      buttonsCount: String(price.vehicleConfiguration?.buttonsCount ?? 0),
      dealerId: price.dealerId ? String(price.dealerId) : "",
      dealerName: "",
      dealerPhone: "",
      dealerAddress: "",
      priceSecureLocksAKL: price.priceSecureLocksAKL ?? "",
      priceSecureLocksAddKey: price.priceSecureLocksAddKey ?? "",
      priceSecureLocksProgramOnly: price.priceSecureLocksProgramOnly ?? "",
      priceSecureLocksParts: price.priceSecureLocksParts ?? "",
      priceDealerTransmitter: price.priceDealerTransmitter ?? "",
      priceDealerBlade: price.priceDealerBlade ?? "",
      priceDealerProgram: price.priceDealerProgram ?? "",
      vin: price.vin ?? "",
      partNumber: price.partNumber ?? "",
      dateCalled: price.dateCalled?.slice(0, 10) ?? "",
      link: price.link ?? "",
      comments: price.comments ?? "",
    });
    setEditorOpen(true);
  };

  const openCopy = (price: CurrentPrice) => {
    openEdit(price);
    setEditorMode("copy");
    setForm((prev) => ({ ...prev, id: undefined }));
  };

  const selectedMakeId = Number(form.makeId || 0);
  const filteredModels = models.filter((m) => m.makeId === selectedMakeId);

  const createDictionaryEntry = async (
    type: "make" | "model" | "key" | "ignition" | "dealer",
  ) => {
    try {
      if (type === "make") {
        const name = window.prompt("New make name");
        if (!name?.trim()) return;
        const make = await http<Make>("/makes", {
          method: "POST",
          body: JSON.stringify({ name: name.trim() }),
        });
        setForm((prev) => ({ ...prev, makeId: String(make.id), modelId: "" }));
      }

      if (type === "model") {
        if (!form.makeId) {
          onError("Select make first");
          return;
        }
        const name = window.prompt("New model name");
        if (!name?.trim()) return;
        const model = await http<Model>("/models", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            makeId: Number(form.makeId),
          }),
        });
        setForm((prev) => ({ ...prev, modelId: String(model.id) }));
      }

      if (type === "key") {
        const name = window.prompt("New key type name");
        if (!name?.trim()) return;
        const keyType = await http<KeyType>("/key-types", {
          method: "POST",
          body: JSON.stringify({ name: name.trim() }),
        });
        setForm((prev) => ({ ...prev, keyTypeId: String(keyType.id) }));
      }

      if (type === "ignition") {
        const name = window.prompt("New ignition type name");
        if (!name?.trim()) return;
        const ignitionType = await http<IgnitionType>("/ignition-types", {
          method: "POST",
          body: JSON.stringify({ name: name.trim() }),
        });
        setForm((prev) => ({
          ...prev,
          ignitionTypeId: String(ignitionType.id),
        }));
      }

      if (type === "dealer") {
        if (!form.dealerName.trim()) {
          onError("Enter dealer name first");
          return;
        }
        const dealer = await http<Dealer>("/dealers", {
          method: "POST",
          body: JSON.stringify({
            name: form.dealerName.trim(),
            phone: form.dealerPhone.trim() || undefined,
            address: form.dealerAddress.trim() || undefined,
          }),
        });
        setForm((prev) => ({ ...prev, dealerId: String(dealer.id) }));
      }

      onSuccess("Dictionary updated");
      await loadSelectors();
      if (hasSearched) {
        await loadPrices(searchFilters);
      }
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const saveRecord = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (
        !form.year ||
        !form.makeId ||
        !form.modelId ||
        !form.keyTypeId ||
        !form.ignitionTypeId
      ) {
        onError("Fill year, make, model, key type and ignition type");
        return;
      }

      let dealerId: number | undefined = form.dealerId?.trim()
        ? Number(form.dealerId)
        : undefined;
      if (dealerId && Number.isNaN(dealerId)) {
        dealerId = undefined;
      }

      if (!dealerId && form.dealerName.trim()) {
        const dealer = await http<Dealer>("/dealers", {
          method: "POST",
          body: JSON.stringify({
            name: form.dealerName.trim(),
            phone: form.dealerPhone.trim() || undefined,
            address: form.dealerAddress.trim() || undefined,
          }),
        });
        dealerId = dealer.id;
      }

      const existingVc = vehicleConfigurations.find(
        (vc) =>
          vc.year === Number(form.year) &&
          vc.makeId === Number(form.makeId) &&
          vc.modelId === Number(form.modelId) &&
          vc.keyTypeId === Number(form.keyTypeId) &&
          vc.ignitionTypeId === Number(form.ignitionTypeId) &&
          vc.buttonsCount === Number(form.buttonsCount || 0),
      );

      let vehicleConfigurationId = existingVc?.id;
      if (!vehicleConfigurationId) {
        const createdVc = await http<VehicleConfiguration>(
          "/vehicle-configurations",
          {
            method: "POST",
            body: JSON.stringify({
              year: Number(form.year),
              makeId: Number(form.makeId),
              modelId: Number(form.modelId),
              keyTypeId: Number(form.keyTypeId),
              ignitionTypeId: Number(form.ignitionTypeId),
              buttonsCount: Number(form.buttonsCount || 0),
            }),
          },
        );
        vehicleConfigurationId = createdVc.id;
      }

      const payload = {
        vehicleConfigurationId,
        dealerId,
        createdByUserId: currentUserId,
        updatedByUserId: currentUserId,
        priceSecureLocksAKL: form.priceSecureLocksAKL || undefined,
        priceSecureLocksAddKey: form.priceSecureLocksAddKey || undefined,
        priceSecureLocksProgramOnly:
          form.priceSecureLocksProgramOnly || undefined,
        priceSecureLocksParts: form.priceSecureLocksParts || undefined,
        priceDealerTransmitter: form.priceDealerTransmitter || undefined,
        priceDealerBlade: form.priceDealerBlade || undefined,
        priceDealerProgram: form.priceDealerProgram || undefined,
        vin: form.vin || undefined,
        partNumber: form.partNumber || undefined,
        dateCalled: form.dateCalled || undefined,
        link: form.link || undefined,
        comments: form.comments || undefined,
      };

      if (editorMode === "edit" && form.id) {
        await http(`/current-prices/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        onSuccess("Record updated");
      } else {
        await http("/current-prices", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        onSuccess(editorMode === "copy" ? "Record copied" : "Record created");
      }

      setEditorOpen(false);
      setForm(blankForm);
      await loadSelectors();
      if (hasSearched) {
        await loadPrices(searchFilters);
      }
    } catch (err) {
      onError((err as Error).message);
    }
  };

  const removePrice = async () => {
    if (!deleting) return;
    try {
      await http(`/current-prices/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      onSuccess("Record deleted");
      await loadSelectors();
      if (hasSearched) {
        await loadPrices(searchFilters);
      }
    } catch (err) {
      onError((err as Error).message);
    }
  };

  return (
    <section className='panel'>
      <h2>Key Search</h2>
      {canWrite && (
        <div className='actions' style={{ marginBottom: 10 }}>
          <button className='btn' onClick={openCreate} type='button'>
            Add Key Card
          </button>
        </div>
      )}
      <form
        className='inline-form mobile-grid'
        onSubmit={(e) => {
          e.preventDefault();
          void loadPrices(searchFilters);
        }}
      >
        <select
          value={searchFilters.year}
          onChange={(e) =>
            setSearchFilters((prev) => ({ ...prev, year: e.target.value }))
          }
        >
          <option value=''>Any year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={searchFilters.typeOfIgnition}
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              typeOfIgnition: e.target.value,
            }))
          }
        >
          <option value=''>Any ignition type</option>
          {availableIgnitionTypes.map((typeOfIgnition) => (
            <option key={typeOfIgnition} value={typeOfIgnition}>
              {typeOfIgnition}
            </option>
          ))}
        </select>

        <select
          value={searchFilters.make}
          onChange={(e) =>
            setSearchFilters((prev) => ({ ...prev, make: e.target.value }))
          }
        >
          <option value=''>Any make</option>
          {availableMakes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={searchFilters.model}
          onChange={(e) =>
            setSearchFilters((prev) => ({ ...prev, model: e.target.value }))
          }
        >
          <option value=''>Any model</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={searchFilters.typeOfKey}
          onChange={(e) =>
            setSearchFilters((prev) => ({ ...prev, typeOfKey: e.target.value }))
          }
        >
          <option value=''>Any key type</option>
          {availableKeyTypes.map((typeOfKey) => (
            <option key={typeOfKey} value={typeOfKey}>
              {typeOfKey}
            </option>
          ))}
        </select>

        <button className='btn'>Search</button>
        <button
          type='button'
          className='btn btn-ghost'
          onClick={() => {
            setSearchFilters({
              year: "",
              make: "",
              model: "",
              typeOfKey: "",
              typeOfIgnition: "",
            });
            setPrices([]);
            setHasSearched(false);
          }}
        >
          Reset
        </button>
      </form>

      <div className='list'>
        {prices.map((price) => (
          <article className='row-card stacked' key={price.id}>
            <strong>Price #{price.id}</strong>
            <p>
              {price.vehicleConfiguration ? (
                <>
                  {price.vehicleConfiguration.year}{" "}
                  {price.vehicleConfiguration.make?.name ||
                    `Make ${price.vehicleConfiguration.makeId}`}{" "}
                  {price.vehicleConfiguration.model?.name ||
                    `Model ${price.vehicleConfiguration.modelId}`}{" "}
                  |{" "}
                  {price.vehicleConfiguration.keyType?.name ||
                    `Type ${price.vehicleConfiguration.keyTypeId}`}{" "}
                  /{" "}
                  {price.vehicleConfiguration.ignitionType?.name ||
                    `Ignition ${price.vehicleConfiguration.ignitionTypeId}`}{" "}
                  | buttons {price.vehicleConfiguration.buttonsCount}
                </>
              ) : (
                `VC #${price.vehicleConfigurationId}`
              )}
            </p>
            <p>
              Dealer:{" "}
              {price.dealer?.name ??
                (price.dealerId ? `#${price.dealerId}` : "No dealer")}{" "}
              | Phone: {price.dealer?.phone || "-"}
            </p>
            <p>
              AKL: {price.priceSecureLocksAKL || "-"} | Add Key:{" "}
              {price.priceSecureLocksAddKey || "-"}
            </p>
            <p>
              SL AKL: {price.priceSecureLocksAKL || "-"} | SL Add Key:{" "}
              {price.priceSecureLocksAddKey || "-"} | SL Program:{" "}
              {price.priceSecureLocksProgramOnly || "-"}
            </p>
            <p>
              Dealer transmitter: {price.priceDealerTransmitter || "-"} | Dealer
              blade: {price.priceDealerBlade || "-"} | Dealer program:{" "}
              {price.priceDealerProgram || "-"}
            </p>
            <p>
              VIN: {price.vin || "-"} | Dealer part #: {price.partNumber || "-"}{" "}
              | Date called: {price.dateCalled || "-"}
            </p>
            <p>Link: {price.link || "-"}</p>
            <p>{price.comments || "No comments"}</p>
            <p className='muted'>
              Created: {new Date(price.createdAt).toLocaleString()} | Updated:{" "}
              {new Date(price.updatedAt).toLocaleString()}
            </p>
            {canWrite && (
              <div className='actions'>
                <button
                  className='btn btn-ghost'
                  type='button'
                  onClick={() => openEdit(price)}
                >
                  Edit
                </button>
                <button
                  className='btn btn-ghost'
                  type='button'
                  onClick={() => openCopy(price)}
                >
                  Copy
                </button>
                <button
                  className='btn btn-danger'
                  type='button'
                  onClick={() => setDeleting(price)}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {editorOpen && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3>
              {editorMode === "edit"
                ? "Edit key card"
                : editorMode === "copy"
                  ? "Copy key card"
                  : "Create key card"}
            </h3>

            <form className='inline-form mobile-grid' onSubmit={saveRecord}>
              <label>
                Year
                <input
                  type='number'
                  min={1900}
                  max={2100}
                  required
                  value={form.year}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, year: e.target.value }))
                  }
                />
              </label>

              <label>
                Make
                <div className='actions'>
                  <select
                    required
                    value={form.makeId}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        makeId: e.target.value,
                        modelId: "",
                      }))
                    }
                  >
                    <option value=''>Select make</option>
                    {makes.map((make) => (
                      <option key={make.id} value={make.id}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-ghost'
                    type='button'
                    onClick={() => void createDictionaryEntry("make")}
                  >
                    +
                  </button>
                </div>
              </label>

              <label>
                Model
                <div className='actions'>
                  <select
                    required
                    value={form.modelId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, modelId: e.target.value }))
                    }
                  >
                    <option value=''>Select model</option>
                    {filteredModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-ghost'
                    type='button'
                    onClick={() => void createDictionaryEntry("model")}
                  >
                    +
                  </button>
                </div>
              </label>

              <label>
                Key type
                <div className='actions'>
                  <select
                    required
                    value={form.keyTypeId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, keyTypeId: e.target.value }))
                    }
                  >
                    <option value=''>Select key type</option>
                    {keyTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-ghost'
                    type='button'
                    onClick={() => void createDictionaryEntry("key")}
                  >
                    +
                  </button>
                </div>
              </label>

              <label>
                Ignition type
                <div className='actions'>
                  <select
                    required
                    value={form.ignitionTypeId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, ignitionTypeId: e.target.value }))
                    }
                  >
                    <option value=''>Select ignition type</option>
                    {ignitionTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-ghost'
                    type='button'
                    onClick={() => void createDictionaryEntry("ignition")}
                  >
                    +
                  </button>
                </div>
              </label>

              <label>
                Buttons count
                <input
                  type='number'
                  min={0}
                  max={12}
                  required
                  value={form.buttonsCount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, buttonsCount: e.target.value }))
                  }
                />
              </label>

              <label>
                Dealer
                <select
                  value={form.dealerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dealerId: e.target.value }))
                  }
                >
                  <option value=''>Select dealer</option>
                  {dealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Or new dealer name
                <input
                  value={form.dealerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dealerName: e.target.value }))
                  }
                />
              </label>
              <label>
                New dealer phone
                <input
                  value={form.dealerPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dealerPhone: e.target.value }))
                  }
                />
              </label>
              <label>
                New dealer address
                <input
                  value={form.dealerAddress}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dealerAddress: e.target.value }))
                  }
                />
              </label>
              <button
                className='btn btn-ghost'
                type='button'
                onClick={() => void createDictionaryEntry("dealer")}
              >
                Create Dealer From Fields
              </button>

              <label>
                SL AKL price
                <input
                  value={form.priceSecureLocksAKL}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceSecureLocksAKL: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                SL Add Key price
                <input
                  value={form.priceSecureLocksAddKey}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceSecureLocksAddKey: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                SL Program price
                <input
                  value={form.priceSecureLocksProgramOnly}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceSecureLocksProgramOnly: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                SL Parts price
                <input
                  value={form.priceSecureLocksParts}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceSecureLocksParts: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Dealer transmitter
                <input
                  value={form.priceDealerTransmitter}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceDealerTransmitter: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Dealer blade
                <input
                  value={form.priceDealerBlade}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, priceDealerBlade: e.target.value }))
                  }
                />
              </label>
              <label>
                Dealer program
                <input
                  value={form.priceDealerProgram}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priceDealerProgram: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                VIN
                <input
                  value={form.vin}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, vin: e.target.value }))
                  }
                />
              </label>
              <label>
                DEALER_PART_NUMBER
                <input
                  value={form.partNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, partNumber: e.target.value }))
                  }
                />
              </label>
              <label>
                Date called
                <input
                  type='date'
                  value={form.dateCalled}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dateCalled: e.target.value }))
                  }
                />
              </label>
              <label>
                Link
                <input
                  value={form.link}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, link: e.target.value }))
                  }
                />
              </label>
              <label>
                Comments
                <input
                  value={form.comments}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, comments: e.target.value }))
                  }
                />
              </label>

              <div className='actions'>
                <button className='btn' type='submit'>
                  {editorMode === "edit"
                    ? "Save Changes"
                    : editorMode === "copy"
                      ? "Create Copy"
                      : "Create"}
                </button>
                <button
                  className='btn btn-ghost'
                  type='button'
                  onClick={() => {
                    setEditorOpen(false);
                    setForm(blankForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3>Delete key card</h3>
            <p>
              Delete record #{deleting.id} (
              {deleting.vehicleConfiguration?.year}{" "}
              {deleting.vehicleConfiguration?.make?.name}{" "}
              {deleting.vehicleConfiguration?.model?.name})?
            </p>
            <div className='actions'>
              <button
                className='btn btn-danger'
                type='button'
                onClick={() => void removePrice()}
              >
                Delete
              </button>
              <button
                className='btn btn-ghost'
                type='button'
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
