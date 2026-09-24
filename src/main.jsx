import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import catalog from './catalog.json';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Copy, Disc3, ExternalLink, Headphones, LoaderCircle, Music2, Play, Plus, RefreshCw, Settings2, Shuffle, Sparkles, X, ShieldCheck } from 'lucide-react';
import './style.css';

const tracks = catalog.map(t => ({...t, title: t.title.replace(/[’‘]/g, "'")}));

const moods=['In my feelings','Main character','Need a reset','Out tonight','On the move','Just vibing'];
const situations=['A late-night drive','Getting ready to go out','Processing a breakup','The city after dark','A solo recharge','A long walk with headphones'];

const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const art=(track)=>`https://images.unsplash.com/photo-${track.album.includes('Dawn FM')?'1519608487953-e999c86e7455':track.album.includes('After Hours')?'1519608487953-e999c86e7455':track.album.includes('Starboy')?'1500530855697-b586d89ba3ee':'1516280440614-37939bbacd81'}?auto=format&fit=crop&w=160&q=75`;

function App(){
  const [mood,setMood]=useState('In my feelings');
  const [situation,setSituation]=useState('A late-night drive');
  const [note,setNote]=useState('');
  const [playlist,setPlaylist]=useState([]);
  const [reason,setReason]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [key,setKey]=useState(sessionStorage.getItem('or_key')||'');
  const [clientId,setClientId]=useState(sessionStorage.getItem('spotify_client_id')||'');
  const [spotifyToken,setSpotifyToken]=useState(sessionStorage.getItem('spotify_token')||'');
  const [duration,setDuration]=useState(30);
  const [toast,setToast]=useState('');

  useEffect(()=>{
    const params=new URLSearchParams(location.search),code=params.get('code'),verifier=sessionStorage.getItem('spotify_verifier'),savedClient=sessionStorage.getItem('spotify_client_id');
    if(!code||!verifier||!savedClient)return;
    sessionStorage.removeItem('spotify_verifier');
    history.replaceState({},'',location.pathname);
    fetch('https://accounts.spotify.com/api/token',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({client_id:savedClient,grant_type:'authorization_code',code,redirect_uri:location.origin+location.pathname,code_verifier:verifier})
    }).then(r=>r.json()).then(data=>{
      if(data.access_token){
        sessionStorage.setItem('spotify_token',data.access_token);
        setSpotifyToken(data.access_token);
        setToast('Spotify connected');
        setTimeout(()=>setToast(''),2500);
      }else setError(data.error_description||'Spotify could not complete sign-in. Check the redirect URI in your Spotify app.');
    }).catch(()=>setError('Spotify sign-in could not finish. Please try connecting again.'));
  },[]);

  const total=playlist.reduce((n,t)=>n+t.time,0); 
  const pct=Math.min(100,total/(duration*60)*100);

  const build=async()=>{
    setLoading(true);
    setError('');
    let selected=[], why='';

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (key.trim()) {
        headers['X-OpenRouter-Key'] = key.trim();
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mood,
          situation,
          note,
          durationSeconds: duration * 60,
          catalog: tracks.map(t => ({ title: t.title, seconds: t.time, tags: t.tags })),
          customApiKey: key.trim() || undefined
        })
      });

      if (res.ok) {
        const json = await res.json();
        let content = json.choices?.[0]?.message?.content || '';
        content = content.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(content);
        
        const aiTitles = parsed.titles || [];
        selected = aiTitles.map(title => tracks.find(t => t.title.toLowerCase() === title.toLowerCase())).filter(Boolean);
        why = parsed.reason || 'Curated by Poolside Laguna XS 2.1';
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `AI API returned status ${res.status}`);
      }
    } catch (e) {
      console.warn('Backend API call error, trying direct OpenRouter fetch:', e);
      if (key.trim()) {
        try {
          const directRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key.trim()}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': location.origin,
              'X-Title': 'After Hours Playlist'
            },
            body: JSON.stringify({
              model: 'poolside/laguna-xs-2.1',
              temperature: 0.45,
              max_tokens: 700,
              messages: [
                { role: 'system', content: 'You are an expert music curator. Select a tailored list of songs ONLY from the provided catalog that best matches the user mood, situation, and custom note. Target the total playlist duration in seconds to be close to durationSeconds. Return JSON only: {"titles": ["exact song title 1", "exact song title 2", ...], "reason": "one evocative sentence under 25 words explaining the vibe"}. Do not invent titles. Output valid JSON.' },
                { role: 'user', content: JSON.stringify({ mood, situation, note, durationSeconds: duration * 60, catalog: tracks.map(t => ({ title: t.title, seconds: t.time, tags: t.tags })) }) }
              ]
            })
          });
          if (directRes.ok) {
            const json = await directRes.json();
            let content = json.choices?.[0]?.message?.content || '';
            content = content.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(content);
            const aiTitles = parsed.titles || [];
            selected = aiTitles.map(title => tracks.find(t => t.title.toLowerCase() === title.toLowerCase())).filter(Boolean);
            why = parsed.reason || 'Curated by Poolside Laguna XS 2.1';
          } else {
            throw new Error(`OpenRouter returned status ${directRes.status}`);
          }
        } catch (clientErr) {
          setError(`AI Generation Error: ${clientErr.message}`);
        }
      } else {
        setError(`AI Generation Error: ${e.message}`);
      }
    }

    if (selected.length > 0) {
      setPlaylist(selected);
      setReason(why);
    }
    setLoading(false);
  };

  const exportText = playlist.map((t, i) => `${String(i + 1).padStart(2, '0')}. ${t.title} — The Weeknd`).join('\n');

  const copy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setToast('Tracklist copied');
    setTimeout(() => { setCopied(false); setToast(''); }, 2200);
  };

  const spotify = () => {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(playlist[0]?.title + ' The Weeknd')}`, '_blank', 'noopener,noreferrer');
    setToast('Spotify opened — add the copied tracks to a new playlist');
    setTimeout(() => setToast(''), 3000);
  };

  const connectSpotify = async () => {
    if (!clientId.trim()) {
      setToast('Add your Spotify Client ID first');
      setTimeout(() => setToast(''), 2200);
      return;
    }
    sessionStorage.setItem('spotify_client_id', clientId.trim());
    const bytes = crypto.getRandomValues(new Uint8Array(64));
    const verifier = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    sessionStorage.setItem('spotify_verifier', verifier);
    const q = new URLSearchParams({
      client_id: clientId.trim(),
      response_type: 'code',
      redirect_uri: location.origin + location.pathname,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      scope: 'playlist-modify-private user-read-private'
    });
    location.href = `https://accounts.spotify.com/authorize?${q}`;
  };

  const createSpotifyPlaylist = async () => {
    if (!spotifyToken) {
      spotify();
      return;
    }
    const playerWindow = window.open('about:blank', '_blank');
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${spotifyToken}`, 'Content-Type': 'application/json' };
      const uris = [];
      for (const t of playlist) {
        const r = await fetch(`https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(`track:"${t.title}" artist:"The Weeknd"`)}`, { headers });
        if (!r.ok) throw new Error(r.status === 401 ? 'Spotify session expired. Reconnect in Settings.' : 'Spotify search failed. Reconnect in Settings and try again.');
        const data = await r.json();
        const match = data.tracks?.items?.find(x => x.artists?.some(a => a.name.toLowerCase() === 'the weeknd')) || data.tracks?.items?.[0];
        if (match?.uri) uris.push(match.uri);
      }
      if (!uris.length) throw new Error('Spotify did not find matching tracks.');

      const created = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: `After Hours — ${situation}`,
          description: `A ${duration}-minute Weeknd set for ${mood.toLowerCase()}. Made with After Hours.`,
          public: false
        })
      });
      if (!created.ok) throw new Error('Spotify could not create the playlist. Reconnect and try again.');
      const pl = await created.json();

      for (let i = 0; i < uris.length; i += 100) {
        const added = await fetch(`https://api.spotify.com/v1/playlists/${pl.id}/items`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ uris: uris.slice(i, i + 100) })
        });
        if (!added.ok) throw new Error('Playlist created, but Spotify could not add all tracks.');
      }
      if (playerWindow) playerWindow.location = pl.external_urls.spotify;
      setToast('Playlist created in Spotify — enjoy the set');
      setTimeout(() => setToast(''), 3500);
    } catch (e) {
      playerWindow?.close();
      setError(e.message);
      if (/session expired|Reconnect/.test(e.message)) {
        sessionStorage.removeItem('spotify_token');
        setSpotifyToken('');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveKey = v => {
    setKey(v);
    if (v) sessionStorage.setItem('or_key', v);
    else sessionStorage.removeItem('or_key');
    setShowSettings(false);
    setToast(v ? 'Custom key saved for this session' : 'Reverted to default backend key');
    setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="app">
      <header className="top">
        <a className="brand" href="#">
          <span className="brandmark"><Disc3 size={17} /></span>
          <span>AFTER HOURS <i className="brand-sub"> / WEEKND SETS</i></span>
        </a>
        <button className="settings" onClick={() => setShowSettings(true)} aria-label="Open settings">
          <Settings2 size={16} />
          <span>Settings</span>
          <span className="keydot on" title="Backend API Key active" />
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="line" /> A SOUNDTRACK FOR RIGHT NOW</div>
            <h1>Your night.<br /><em>Your Weeknd.</em></h1>
            <p>Tell us where your head’s at. Poolside Laguna XS 2.1 will generate a set from The Weeknd’s 231 released songs.</p>
            <div className="hero-meta">
              <span><Headphones size={14} /> 30 MINUTES, GIVE OR TAKE</span>
              <span className="dot-sep">·</span>
              <span>100% AI GENERATED SETS</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            <div className="moon" />
            <div className="silhouette s1" />
            <div className="silhouette s2" />
            <div className="cover-title">AFTER<br />HOURS</div>
            <div className="cover-stamp">AI CURATION · ALL 231 TRACKS</div>
            <div className="cover-sheen" />
          </div>
        </section>

        <section className="workspace">
          <div className="form-panel">
            <div className="section-kicker"><span>01</span> SET THE SCENE</div>
            <label className="field-label">What’s your mood?</label>
            <div className="chips">
              {moods.map(m => (
                <button key={m} onClick={() => setMood(m)} className={`chip ${mood === m ? 'active' : ''}`}>
                  {m}
                </button>
              ))}
            </div>

            <label className="field-label second">What’s the situation?</label>
            <div className="select-wrap">
              <select value={situation} onChange={e => setSituation(e.target.value)}>
                {situations.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>

            <label className="field-label second">Anything else on your mind? <span className="optional">OPTIONAL</span></label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="A few words help set the tone…"
              maxLength={180}
            />

            <div className="form-bottom">
              <label className="length-select">
                <Clock3 size={15} />
                <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                  <option value="25">25 min</option>
                  <option value="30">30 min</option>
                  <option value="35">35 min</option>
                </select>
                <ChevronDown size={13} />
              </label>
              <button className="build-btn" onClick={build} disabled={loading}>
                {loading ? <><LoaderCircle className="spin" size={16} /> AI CURATING</> : <><Sparkles size={15} /> MAKE MY SET <ArrowRight size={15} /></>}
              </button>
            </div>

            <div className="model-caption">
              <span className="model-indicator ready" />
              {key ? 'CUSTOM OPENROUTER KEY ACTIVE' : 'POWERED BY POOLSIDE LAGUNA XS 2.1 (BACKEND CONNECTED)'}
            </div>
          </div>

          <div className="playlist-panel">
            <div className="playlist-head">
              <div>
                <div className="section-kicker"><span>02</span> YOUR SET</div>
                <h2>{playlist.length ? 'Made for this moment' : 'The good part starts here.'}</h2>
              </div>
              {playlist.length > 0 && (
                <button className="icon-button" title="Make a new version" onClick={build}>
                  <RefreshCw size={16} />
                </button>
              )}
            </div>

            {error && <div className="error">{error}</div>}

            {playlist.length === 0 ? (
              <div className="empty-state">
                <div className="empty-orbit">
                  <Music2 size={23} />
                  <span />
                </div>
                <p>Your set is one good prompt away.</p>
                <small>Pick a mood, set the scene, and we’ll take it from there.</small>
                <div className="empty-wave">
                  <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>
            ) : (
              <>
                <div className="set-reason">
                  <Sparkles size={13} />
                  {reason}
                </div>
                <div className="duration-bar">
                  <div className="duration-label">
                    <span><Clock3 size={13} /> {fmt(total)} OF {duration}:00</span>
                    <span>{Math.max(0, Math.floor((duration * 60 - total) / 60))} MIN LEFT</span>
                  </div>
                  <div className="bar">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="track-list">
                  {playlist.map((t, i) => (
                    <div className="track" key={t.title}>
                      <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
                      <img src={art(t)} alt={t.title} loading="lazy" />
                      <div className="track-main">
                        <strong>{t.title}</strong>
                        <span>{t.featured ? 'Guest feature · ' : ''}{t.album} <b>·</b> {t.year}</span>
                      </div>
                      <span className="track-time">{fmt(t.time)}</span>
                      <a
                        className="track-open"
                        href={`https://open.spotify.com/search/${encodeURIComponent(t.title + ' The Weeknd')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Find on Spotify"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>

                <div className="export-actions">
                  <button className="copy-btn" onClick={copy}>
                    {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'COPIED' : 'COPY TRACKLIST'}
                  </button>
                  <button className="spotify-btn" onClick={spotifyToken ? createSpotifyPlaylist : spotify} disabled={loading}>
                    {loading ? <LoaderCircle className="spin" size={15} /> : <Play size={15} fill="currentColor" />}
                    {spotifyToken ? 'CREATE & PLAY IN SPOTIFY' : 'OPEN IN SPOTIFY'} <ExternalLink size={13} />
                  </button>
                </div>
                <div className="export-note">
                  {spotifyToken ? 'Creates a private playlist in Spotify and opens it.' : 'Connect Spotify in Settings to create this set as a playlist. Or copy the tracklist and use the Spotify links.'}
                </div>
              </>
            )}
          </div>
        </section>

        <footer>
          <span>MADE FOR THE MOMENT <b>✳</b> 100% AI GENERATED FROM 231 TRACK CATALOG</span>
          <span>NOT AFFILIATED WITH THE ARTIST OR SPOTIFY</span>
        </footer>
      </main>

      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}

      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="section-kicker"><span>✳</span> PERSONALIZE</div>
                <h3>Settings & API</h3>
              </div>
              <button className="icon-button" onClick={() => setShowSettings(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="backend-status-card">
              <ShieldCheck size={18} className="shield-icon" />
              <div>
                <strong>Backend API Key Configured</strong>
                <p>OpenRouter API key is securely embedded in your Vercel backend (`sk-or-v1-...`). Playlists are generated 100% by AI!</p>
              </div>
            </div>

            <label className="field-label">CUSTOM OPENROUTER KEY (OPTIONAL OVERRIDE)</label>
            <input
              className="key-input"
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Leave blank to use default Vercel backend key"
              autoComplete="off"
            />
            <div className="key-help">
              Want to use your personal key? Get one at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai/keys <ExternalLink size={11} /></a>.
            </div>

            <div className="divider" />

            <div className="spotify-connect-head">
              <span className="spotify-badge">S</span>
              <div>
                <strong>Spotify Connection</strong>
                <small>{spotifyToken ? 'Connected for this session' : 'Connect to create playlists directly in your Spotify account'}</small>
              </div>
            </div>

            <label className="field-label spotify-id-label">SPOTIFY DEVELOPER APP CLIENT ID</label>
            <input
              className="key-input"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder="Paste Spotify Client ID"
              autoComplete="off"
            />
            <div className="key-help">
              Create an app at <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">Spotify Developer Dashboard <ExternalLink size={11} /></a> and add <code>{location.origin + location.pathname}</code> as a Redirect URI.
            </div>

            <div className="modal-actions">
              <button
                className="clear-btn"
                onClick={() => {
                  saveKey('');
                  sessionStorage.removeItem('spotify_token');
                  sessionStorage.removeItem('spotify_client_id');
                  setSpotifyToken('');
                  setClientId('');
                }}
              >
                RESET TO DEFAULTS
              </button>
              <div className="settings-buttons">
                <button
                  className="save-small"
                  onClick={() => {
                    sessionStorage.setItem('spotify_client_id', clientId.trim());
                    saveKey(key.trim());
                  }}
                >
                  <Check size={14} /> SAVE SETTINGS
                </button>
                <button className="build-btn" onClick={() => connectSpotify()}>
                  <Headphones size={14} /> {spotifyToken ? 'RECONNECT' : 'CONNECT SPOTIFY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
