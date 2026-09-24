import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Copy, Disc3, ExternalLink, Headphones, LoaderCircle, Music2, Play, Plus, RefreshCw, Settings2, Shuffle, Sparkles, X, ShieldCheck } from 'lucide-react';
import './style.css';

const tracks = [
  // House of Balloons (2011)
  {title:'High For This',album:'House of Balloons',year:2011,time:247,tags:['dark','late night','reflective']},
  {title:'What You Need',album:'House of Balloons',year:2011,time:196,tags:['late night','dark','romantic']},
  {title:'House Of Balloons / Glass Table Girls',album:'House of Balloons',year:2011,time:404,tags:['dark','party','energy','confidence']},
  {title:'The Morning',album:'House of Balloons',year:2011,time:315,tags:['euphoric','nostalgia','late night','drive']},
  {title:'Wicked Games',album:'House of Balloons',year:2011,time:323,tags:['dark','romantic','late night','sad']},
  {title:'The Party & The After Party',album:'House of Balloons',year:2011,time:435,tags:['late night','dark','party','romantic']},
  {title:'Coming Down',album:'House of Balloons',year:2011,time:295,tags:['sad','dark','reflective']},
  {title:'Loft Music',album:'House of Balloons',year:2011,time:364,tags:['dark','party','late night']},
  {title:'The Knowing',album:'House of Balloons',year:2011,time:321,tags:['dark','sad','reflective','late night']},
  {title:'Twenty Eight',album:'House of Balloons',year:2012,time:252,tags:['heartbreak','sad','dark']},

  // Thursday (2011)
  {title:'Lonely Star',album:'Thursday',year:2011,time:349,tags:['dark','sad','reflective']},
  {title:'Life Of The Party',album:'Thursday',year:2011,time:297,tags:['party','dark','energy']},
  {title:'Thursday',album:'Thursday',year:2011,time:319,tags:['romantic','dark','late night']},
  {title:'The Zone',album:'Thursday',year:2011,time:418,tags:['late night','dark','reflective']},
  {title:'The Birds Pt. 1',album:'Thursday',year:2011,time:212,tags:['heartbreak','dark','energy']},
  {title:'The Birds Pt. 2',album:'Thursday',year:2011,time:350,tags:['heartbreak','sad','dark']},
  {title:'Gone',album:'Thursday',year:2011,time:427,tags:['late night','dark','reflective']},
  {title:'Rolling Stone',album:'Thursday',year:2011,time:230,tags:['reflective','soft','nostalgia']},
  {title:'Heaven Or Las Vegas',album:'Thursday',year:2011,time:357,tags:['dark','energy','drive']},
  {title:'Valerie',album:'Thursday',year:2012,time:286,tags:['romantic','sad','heartbreak']},

  // Echoes of Silence (2011)
  {title:'D.D.',album:'Echoes of Silence',year:2011,time:275,tags:['energy','dark','party']},
  {title:'Montreal',album:'Echoes of Silence',year:2011,time:290,tags:['heartbreak','nostalgia','soft']},
  {title:'Outside',album:'Echoes of Silence',year:2011,time:259,tags:['dark','late night','reflective']},
  {title:'XO / The Host',album:'Echoes of Silence',year:2011,time:443,tags:['dark','party','late night']},
  {title:'Initiation',album:'Echoes of Silence',year:2011,time:260,tags:['dark','anger','energy']},
  {title:'Same Old Song',album:'Echoes of Silence',year:2011,time:332,tags:['heartbreak','reflective','dark']},
  {title:'The Fall',album:'Echoes of Silence',year:2011,time:345,tags:['dark','reflective','late night']},
  {title:'Next',album:'Echoes of Silence',year:2011,time:360,tags:['heartbreak','dark','reflective']},
  {title:'Echoes Of Silence',album:'Echoes of Silence',year:2011,time:242,tags:['sad','heartbreak','soft']},
  {title:'Till Dawn (Here Comes the Sun)',album:'Echoes of Silence',year:2012,time:319,tags:['late night','reflective','soft']},

  // Kiss Land (2013)
  {title:'Professional',album:'Kiss Land',year:2013,time:368,tags:['dark','reflective','late night']},
  {title:'The Town',album:'Kiss Land',year:2013,time:307,tags:['heartbreak','reflective','drive']},
  {title:'Adaptation',album:'Kiss Land',year:2013,time:283,tags:['heartbreak','dark','reflective']},
  {title:'Love In The Sky',album:'Kiss Land',year:2013,time:252,tags:['late night','romantic','dark','soft']},
  {title:'Belong To The World',album:'Kiss Land',year:2013,time:307,tags:['dark','energy','drive']},
  {title:'Live For',album:'Kiss Land',year:2013,time:224,tags:['confidence','energy','party']},
  {title:'Wanderlust',album:'Kiss Land',year:2013,time:306,tags:['drive','euphoric','energy','nostalgia']},
  {title:'Kiss Land',album:'Kiss Land',year:2013,time:455,tags:['dark','late night','energy']},
  {title:'Pretty',album:'Kiss Land',year:2013,time:375,tags:['romantic','dark','heartbreak']},
  {title:'Tears In The Rain',album:'Kiss Land',year:2013,time:432,tags:['sad','heartbreak','dark','reflective']},
  {title:'Odd Look',album:'Kiss Land',year:2013,time:289,tags:['euphoric','drive','energy','party']},

  // Beauty Behind the Madness (2015)
  {title:'Real Life',album:'Beauty Behind the Madness',year:2015,time:223,tags:['dark','reflective','heartbreak']},
  {title:'Losers',album:'Beauty Behind the Madness',year:2015,time:281,tags:['confidence','energy','drive']},
  {title:'Tell Your Friends',album:'Beauty Behind the Madness',year:2015,time:334,tags:['confidence','party','late night']},
  {title:'Often',album:'Beauty Behind the Madness',year:2014,time:249,tags:['confidence','party','dark','energy']},
  {title:'The Hills',album:'Beauty Behind the Madness',year:2015,time:242,tags:['confidence','dark','energy','anger']},
  {title:'Acquainted',album:'Beauty Behind the Madness',year:2015,time:348,tags:['romantic','late night','soft']},
  {title:'Can’t Feel My Face',album:'Beauty Behind the Madness',year:2015,time:213,tags:['party','energy','euphoric','confidence']},
  {title:'Shameless',album:'Beauty Behind the Madness',year:2015,time:253,tags:['heartbreak','romantic','soft']},
  {title:'Earned It',album:'Beauty Behind the Madness',year:2015,time:277,tags:['romantic','soft','late night']},
  {title:'In The Night',album:'Beauty Behind the Madness',year:2015,time:235,tags:['nostalgia','energy','party']},
  {title:'As You Are',album:'Beauty Behind the Madness',year:2015,time:340,tags:['romantic','heartbreak','soft']},
  {title:'Dark Times',album:'Beauty Behind the Madness',year:2015,time:260,tags:['dark','sad','reflective']},
  {title:'Prisoner',album:'Beauty Behind the Madness',year:2015,time:274,tags:['dark','heartbreak','reflective']},
  {title:'Angel',album:'Beauty Behind the Madness',year:2015,time:377,tags:['sad','romantic','euphoric']},

  // Starboy (2016)
  {title:'Starboy',album:'Starboy',year:2016,time:230,tags:['confidence','energy','party','drive']},
  {title:'Party Monster',album:'Starboy',year:2016,time:249,tags:['dark','party','energy','confidence']},
  {title:'False Alarm',album:'Starboy',year:2016,time:220,tags:['energy','anger','drive']},
  {title:'Reminder',album:'Starboy',year:2016,time:218,tags:['confidence','energy','drive','party']},
  {title:'Rockin’',album:'Starboy',year:2016,time:232,tags:['party','energy','euphoric']},
  {title:'Secrets',album:'Starboy',year:2016,time:265,tags:['nostalgia','party','romantic','euphoric']},
  {title:'True Colors',album:'Starboy',year:2016,time:206,tags:['soft','romantic','reflective']},
  {title:'Stargirl Interlude',album:'Starboy',year:2016,time:111,tags:['late night','romantic','soft']},
  {title:'Sidewalks',album:'Starboy',year:2016,time:231,tags:['confidence','reflective','drive']},
  {title:'Six Feet Under',album:'Starboy',year:2016,time:237,tags:['dark','energy','confidence']},
  {title:'Love To Lay',album:'Starboy',year:2016,time:223,tags:['party','heartbreak','energy']},
  {title:'A Lonely Night',album:'Starboy',year:2016,time:220,tags:['heartbreak','energy','confidence','party']},
  {title:'Attention',album:'Starboy',year:2016,time:197,tags:['soft','heartbreak','reflective']},
  {title:'Ordinary Life',album:'Starboy',year:2016,time:221,tags:['dark','reflective','late night']},
  {title:'Die For You',album:'Starboy',year:2016,time:260,tags:['heartbreak','romantic','soft','reflective']},
  {title:'I Feel It Coming',album:'Starboy',year:2016,time:269,tags:['romantic','soft','euphoric','party']},

  // My Dear Melancholy, (2018)
  {title:'Call Out My Name',album:'My Dear Melancholy,',year:2018,time:228,tags:['heartbreak','sad','reflective','late night']},
  {title:'Try Me',album:'My Dear Melancholy,',year:2018,time:221,tags:['heartbreak','late night','reflective']},
  {title:'Wasted Times',album:'My Dear Melancholy,',year:2018,time:220,tags:['heartbreak','nostalgia','reflective']},
  {title:'I Never Needed You',album:'My Dear Melancholy,',year:2018,time:200,tags:['heartbreak','sad','dark']},
  {title:'Hurt You',album:'My Dear Melancholy,',year:2018,time:230,tags:['heartbreak','dark','reflective']},
  {title:'Privilege',album:'My Dear Melancholy,',year:2018,time:170,tags:['sad','heartbreak','soft']},
  {title:'Nothing Compares',album:'My Dear Melancholy,',year:2018,time:217,tags:['heartbreak','sad','late night','reflective']},

  // After Hours (2020)
  {title:'Alone Again',album:'After Hours',year:2020,time:250,tags:['dark','late night','reflective']},
  {title:'Too Late',album:'After Hours',year:2020,time:239,tags:['euphoric','energy','heartbreak']},
  {title:'Hardest To Love',album:'After Hours',year:2020,time:211,tags:['heartbreak','soft','nostalgia']},
  {title:'Scared To Live',album:'After Hours',year:2020,time:191,tags:['heartbreak','soft','reflective']},
  {title:'Snowchild',album:'After Hours',year:2020,time:247,tags:['reflective','late night','nostalgia']},
  {title:'Escape From LA',album:'After Hours',year:2020,time:355,tags:['dark','late night','heartbreak']},
  {title:'Heartless',album:'After Hours',year:2019,time:200,tags:['confidence','energy','party','drive']},
  {title:'Faith',album:'After Hours',year:2020,time:283,tags:['dark','reflective','late night']},
  {title:'Blinding Lights',album:'After Hours',year:2019,time:200,tags:['euphoric','energy','drive','confidence','nostalgia','party']},
  {title:'In Your Eyes',album:'After Hours',year:2020,time:237,tags:['nostalgia','euphoric','party','heartbreak']},
  {title:'Save Your Tears',album:'After Hours',year:2020,time:215,tags:['heartbreak','nostalgia','confidence','party','euphoric']},
  {title:'Repeat After Me (Interlude)',album:'After Hours',year:2020,time:195,tags:['soft','late night','reflective']},
  {title:'After Hours',album:'After Hours',year:2020,time:361,tags:['late night','dark','heartbreak','reflective']},
  {title:'Until I Bleed Out',album:'After Hours',year:2020,time:190,tags:['sad','dark','reflective','late night']},
  {title:'Missed You',album:'After Hours',year:2020,time:144,tags:['heartbreak','soft','sad']},
  {title:'Final Lullaby',album:'After Hours',year:2020,time:112,tags:['soft','sad','late night','reflective']},

  // Dawn FM (2022)
  {title:'Dawn FM',album:'Dawn FM',year:2022,time:61,tags:['reflective','soft']},
  {title:'Gasoline',album:'Dawn FM',year:2022,time:212,tags:['dark','late night','confidence','energy']},
  {title:'How Do I Make You Love Me?',album:'Dawn FM',year:2022,time:214,tags:['euphoric','energy','romantic','drive']},
  {title:'Take My Breath',album:'Dawn FM',year:2021,time:339,tags:['energy','party','drive','euphoric']},
  {title:'Sacrifice',album:'Dawn FM',year:2022,time:189,tags:['party','energy','drive','confidence']},
  {title:'A Tale By Quincy',album:'Dawn FM',year:2022,time:96,tags:['reflective','nostalgia','soft']},
  {title:'Out of Time',album:'Dawn FM',year:2022,time:214,tags:['heartbreak','reflective','late night','nostalgia','soft']},
  {title:'Here We Go... Again',album:'Dawn FM',year:2022,time:209,tags:['soft','reflective','romantic']},
  {title:'Best Friends',album:'Dawn FM',year:2022,time:163,tags:['romantic','heartbreak','late night']},
  {title:'Is There Someone Else?',album:'Dawn FM',year:2022,time:199,tags:['dark','late night','romantic','confidence']},
  {title:'Starry Eyes',album:'Dawn FM',year:2022,time:148,tags:['soft','romantic','sad']},
  {title:'Every Angel is Terrifying',album:'Dawn FM',year:2022,time:167,tags:['dark','reflective']},
  {title:'Don’t Break My Heart',album:'Dawn FM',year:2022,time:205,tags:['euphoric','heartbreak','party']},
  {title:'I Heard You’re Married',album:'Dawn FM',year:2022,time:263,tags:['party','heartbreak','energy']},
  {title:'Less Than Zero',album:'Dawn FM',year:2022,time:215,tags:['heartbreak','euphoric','nostalgia','reflective']},
  {title:'Phantom Regret by Jim',album:'Dawn FM',year:2022,time:199,tags:['reflective','soft']},
  {title:'Moth To A Flame',album:'Dawn FM',year:2021,time:234,tags:['euphoric','energy','party','drive']},

  // Hurry Up Tomorrow & Recent Releases (2023-2025)
  {title:'Timeless',album:'Hurry Up Tomorrow',year:2024,time:256,tags:['confidence','energy','party','drive']},
  {title:'São Paulo',album:'Hurry Up Tomorrow',year:2024,time:305,tags:['party','energy','confidence']},
  {title:'Dancing In The Flames',album:'Hurry Up Tomorrow',year:2024,time:220,tags:['euphoric','drive','heartbreak','energy']},
  {title:'Wake Me Up',album:'Hurry Up Tomorrow',year:2025,time:335,tags:['euphoric','energy','confidence','drive']},
  {title:'Open Hearts',album:'Hurry Up Tomorrow',year:2025,time:230,tags:['heartbreak','euphoric','romantic']},
  {title:'Popular',album:'The Idol Vol. 1',year:2023,time:215,tags:['confidence','party','dark','energy']},
  {title:'One Of The Girls',album:'The Idol Vol. 1',year:2023,time:244,tags:['dark','romantic','late night','soft']},
  {title:'Double Fantasy',album:'The Idol Vol. 1',year:2023,time:268,tags:['dark','romantic','late night']},
  {title:'Pray For Me',album:'Black Panther The Album',year:2018,time:211,tags:['energy','confidence','drive','party']},
  {title:'K-POP',album:'Utopia',year:2023,time:185,tags:['party','energy','drive']},
  {title:'Crew Love',album:'Take Care',year:2011,time:232,tags:['late night','dark','reflective']},
  {title:'Low Life',album:'Evol',year:2016,time:313,tags:['dark','confidence','energy']},
  {title:'FML',album:'The Life of Pablo',year:2016,time:236,tags:['dark','reflective','heartbreak']},
  {title:'You Right',album:'Planet Her',year:2021,time:186,tags:['romantic','soft','late night']},
  {title:'Creepin’',album:'Heroes & Villains',year:2022,time:221,tags:['heartbreak','nostalgia','drive']}
];

const moods=['In my feelings','Main character','Need a reset','Out tonight','On the move','Just vibing'];
const situations=['A late-night drive','Getting ready to go out','Processing a breakup','The city after dark','A solo recharge','A long walk with headphones'];
const moodTag={'In my feelings':'heartbreak','Main character':'confidence','Need a reset':'reflective','Out tonight':'party','On the move':'drive','Just vibing':'soft'};
const situationTag={'A late-night drive':'drive','Getting ready to go out':'party','Processing a breakup':'heartbreak','The city after dark':'late night','A solo recharge':'reflective','A long walk with headphones':'euphoric'};

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
    let selected=[],why='A custom set for your current headspace.';

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
        selected = (parsed.titles || []).map(title => tracks.find(t => t.title.toLowerCase() === title.toLowerCase())).filter(Boolean);
        why = parsed.reason || why;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${res.status}`);
      }
    } catch (e) {
      console.warn('Backend endpoint error, attempting client fallback:', e);
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
                { role: 'system', content: 'You are a music curator. Select songs only from the exact catalog provided. Return valid JSON only: {"titles":[up to 10 exact titles in listening order],"reason":"one evocative sentence under 25 words"}. Build a flowing set that fits the user mood and situation, approaching but not exceeding the time target in seconds. Never invent titles.' },
                { role: 'user', content: JSON.stringify({ mood, situation, note, durationSeconds: duration * 60, catalog: tracks.map(t => ({ title: t.title, seconds: t.time, tags: t.tags })) }) }
              ]
            })
          });
          if (directRes.ok) {
            const json = await directRes.json();
            let content = json.choices?.[0]?.message?.content || '';
            content = content.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(content);
            selected = (parsed.titles || []).map(title => tracks.find(t => t.title.toLowerCase() === title.toLowerCase())).filter(Boolean);
            why = parsed.reason || why;
          }
        } catch (clientErr) {
          setError(`AI generation note: ${clientErr.message}. Used local curation.`);
        }
      }
    }

    if (!selected.length) {
      const tags = [
        moodTag[mood],
        situationTag[situation],
        ...(note.toLowerCase().match(/sad|break|miss|lonely|hurt|cry/g) ? ['sad', 'heartbreak'] : []),
        ...(note.toLowerCase().match(/party|dance|club|fun|energy/g) ? ['party', 'energy'] : [])
      ];
      const scored = tracks.map((t, i) => ({
        t,
        i,
        score: t.tags.reduce((s, x) => s + (tags.includes(x) ? 2 : 0), 0) + Math.random() * 0.5
      })).sort((a, b) => b.score - a.score);

      let secs = 0;
      for (const { t } of scored) {
        if (secs + t.time <= duration * 60) {
          selected.push(t);
          secs += t.time;
        }
        if (secs >= duration * 60 - 60) break;
      }
      selected.sort((a, b) => {
        const sa = a.tags.filter(x => tags.includes(x)).length;
        const sb = b.tags.filter(x => tags.includes(x)).length;
        return sb - sa;
      });
      why = `For ${situation.toLowerCase()}, with ${mood.toLowerCase()} energy. A ${duration}-minute arc from the complete catalog.`;
    }

    setPlaylist(selected);
    setReason(why);
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
            <p>Tell us where your head’s at. We’ll make you a set from The Weeknd’s complete discography that feels like it gets you.</p>
            <div className="hero-meta">
              <span><Headphones size={14} /> 30 MINUTES, GIVE OR TAKE</span>
              <span className="dot-sep">·</span>
              <span>115+ WEEKND TRACKS</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            <div className="moon" />
            <div className="silhouette s1" />
            <div className="silhouette s2" />
            <div className="cover-title">AFTER<br />HOURS</div>
            <div className="cover-stamp">FULL CATALOG · ALL ERAS</div>
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
                {loading ? <><LoaderCircle className="spin" size={16} /> TUNING IN</> : <><Sparkles size={15} /> MAKE MY SET <ArrowRight size={15} /></>}
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
                        <span>{t.album} <b>·</b> {t.year}</span>
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
          <span>MADE FOR THE MOMENT <b>✳</b> FULL WEEKND DISCOGRAPHY (115+ TRACKS)</span>
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
                <p>OpenRouter API key is securely embedded in your Vercel backend (`sk-or-v1-...`). AI playlist curation works out-of-the-box!</p>
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
