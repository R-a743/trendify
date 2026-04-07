import React, { useState, useEffect } from 'react';

function App() {
  const [hepsi, setHepsi] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifKategori, setAktifKategori] = useState('hepsi');
  const [aramaMetni, setAramaMetni] = useState('');
  const [sepet, setSepet] = useState([]);
  const [favoriler, setFavoriler] = useState([]);
  const [sayfa, setSayfa] = useState('market');

  const kategoriSozlugu = {
    'hepsi': 'TÜM ÜRÜNLER',
    "men's clothing": 'ERKEK GİYİM',
    "jewelery": 'TAKILAR',
    "electronics": 'TEKNOLOJİ',
    "women's clothing": 'KADIN GİYİM'
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setHepsi(data);
        setUrunler(data);
        setYukleniyor(false);
      });
  }, []);

  useEffect(() => {
    let sonuc = hepsi;
    if (aktifKategori !== 'hepsi') sonuc = sonuc.filter(item => item.category === aktifKategori);
    if (aramaMetni) sonuc = sonuc.filter(item => item.title.toLowerCase().includes(aramaMetni.toLowerCase()));
    setUrunler(sonuc);
  }, [aktifKategori, aramaMetni, hepsi]);

  const sepeteEkle = (urun) => setSepet([...sepet, urun]);
  const sepettenCikar = (index) => setSepet(sepet.filter((_, i) => i !== index));
  const favoriEkle = (urun) => {
    if (favoriler.find(f => f.id === urun.id)) {
      setFavoriler(favoriler.filter(f => f.id !== urun.id));
    } else {
      setFavoriler([...favoriler, urun]);
    }
  };

  
  const toplamTutar = sepet.reduce((toplam, urun) => toplam + urun.price, 0).toFixed(2);

  if (yukleniyor) return <div style={centerStyle}>Mağaza Açılıyor Tatlım... ✨</div>;

  return (
    <div style={{ backgroundColor: '#fff5f7', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
      
      
      <nav style={navStyle}>
        <div onClick={() => setSayfa('market')} style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff4d8d', cursor: 'pointer' }}>✨ Trendify</div>
        <input type="text" placeholder="Ürün ara aşko..." style={searchInputStyle} onChange={(e) => setAramaMetni(e.target.value)} />
        <div style={{ display: 'flex', gap: '20px' }}>
          <div onClick={() => setSayfa('favori')} style={iconButtonStyle}>❤️ <span style={badgeStyle}>{favoriler.length}</span></div>
          <div onClick={() => setSayfa('sepet')} style={iconButtonStyle}>🛒 <span style={badgeStyle}>{sepet.length}</span></div>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        
        {/* MARKET SAYFASI */
        {sayfa === 'market' && (
          <>
            <div style={filterBox}>
              {Object.keys(kategoriSozlugu).map(kat => (
                <button key={kat} onClick={() => setAktifKategori(kat)} style={{...filterBtn, backgroundColor: aktifKategori === kat ? '#ff4d8d' : 'white', color: aktifKategori === kat ? 'white' : '#ff4d8d'}}>{kategoriSozlugu[kat]}</button>
              ))}
            </div>
            <div style={gridStyle}>
              {urunler.map(urun => (
                <div key={urun.id} style={cardStyle}>
                  <div style={imgBox}><img src={urun.image} alt="" style={imgStyle}/></div>
                  <div style={{padding: '15px'}}>
                    <h4 style={titleStyle}>{urun.title}</h4>
                    <div style={priceRow}>
                      <span style={{fontWeight:'bold'}}>${urun.price}</span>
                      <div style={{display:'flex', gap:'5px'}}>
                         <button onClick={() => favoriEkle(urun)} style={circleBtn}>{favoriler.find(f=>f.id===urun.id) ? '❤️' : '🤍'}</button>
                         <button onClick={() => sepeteEkle(urun)} style={addBtn}>Sepete Ekle</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SEPET SAYFASI */}
        {sayfa === 'sepet' && (
          <div style={listContainer}>
            <h2 style={{color: '#ff4d8d'}}>Alışveriş Sepetim 🛍️</h2>
            <hr style={{border:'0.5px solid #eee'}} />
            {sepet.length === 0 ? <p>Sepetin şu an boş, hemen bir şeyler al! ✨</p> : 
              <>
                {sepet.map((item, index) => (
                  <div key={index} style={listItem}>
                    <img src={item.image} width="50" height="50" style={{objectFit:'contain'}} alt=""/>
                    <p style={{flex:1, marginLeft:'15px', fontSize:'0.9rem'}}>{item.title}</p>
                    <b style={{marginRight: '15px'}}>${item.price}</b>
                    <button onClick={() => sepettenCikar(index)} style={deleteBtn}>🗑️</button>
                  </div>
                ))}
                
                {/* TOPLAM TUTAR BÖLÜMÜ */}
                <div style={totalBox}>
                   <h3 style={{margin:0}}>Genel Toplam:</h3>
                   <h3 style={{margin:0, color:'#ff4d8d'}}>${toplamTutar}</h3>
                </div>
                
                <button onClick={() => alert('Ödeme ekranına yönlendiriliyorsun! 💳')} style={payBtn}>Ödemeye Geç 🔥</button>
              </>
            }
            <button onClick={() => setSayfa('market')} style={backBtn}>← Alışverişe Dön</button>
          </div>
        )}

      
        {sayfa === 'favori' && (
          <div style={listContainer}>
            <h2 style={{color: '#ff4d8d'}}>Favoriler ❤️</h2>
            {favoriler.length === 0 ? <p>Henüz favorilerinde ürün yok... 💔</p> : (
              <div style={gridStyle}>
                {favoriler.map(urun => (
                  <div key={urun.id} style={cardStyle}>
                    <img src={urun.image} height="80" alt="" style={{objectFit:'contain', marginTop:'10px'}}/>
                    <p style={{fontSize:'0.8rem', padding:'5px'}}>{urun.title}</p>
                    <button onClick={() => favoriEkle(urun)} style={deleteBtn}>Listeden Çıkar</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setSayfa('market')} style={backBtn}>Geri Dön</button>
          </div>
        )}
      </div>
    </div>
  );
}


const totalBox = { display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '15px', borderTop: '2px solid #ff4d8d', backgroundColor: '#fff9fb' };
const payBtn = { width: '100%', padding: '15px', backgroundColor: '#ff4d8d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '15px', boxShadow: '0 5px 15px rgba(255,77,141,0.3)' };

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const searchInputStyle = { padding: '10px 20px', borderRadius: '20px', border: '1px solid #ffcae0', width: '40%', outline: 'none' };
const iconButtonStyle = { fontSize: '1.5rem', position: 'relative', cursor: 'pointer' };
const badgeStyle = { backgroundColor: '#ff4d8d', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.7rem', position: 'absolute', top: '-5px', right: '-10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' };
const imgBox = { height: '150px', padding: '15px', backgroundColor: '#fdfdfd' };
const imgStyle = { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' };
const titleStyle = { fontSize: '0.8rem', height: '35px', overflow: 'hidden', margin: '10px 0' };
const priceRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const addBtn = { backgroundColor: '#ff4d8d', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem' };
const circleBtn = { background: 'none', border: '1px solid #eee', borderRadius: '50%', cursor: 'pointer', padding: '5px' };
const filterBox = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' };
const filterBtn = { border: '1px solid #ff4d8d', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ff4d8d', fontWeight: 'bold' };
const listContainer = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' };
const listItem = { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' };
const deleteBtn = { color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '10px' };
const backBtn = { marginTop: '20px', padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' };

export default App;
