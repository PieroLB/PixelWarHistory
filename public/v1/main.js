const drawGrille = (history) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const boxSize = canvas.height / Math.sqrt(history.length);
    let pos = 0;
    for (let i = 0; i < Math.sqrt(history.length); i++) { //Lignes
        for (let j = 0; j < Math.sqrt(history.length); j++) { //Colonnes
            ctx.fillStyle = `rgb(${history[pos].color[0]},${history[pos].color[1]},${history[pos].color[2]})`;
            ctx.fillRect(j * boxSize, i * boxSize, boxSize, boxSize);
            pos++;
        }
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = innerHeight*0.93;
canvas.width = canvas.height;

dayjs().format();
document.getElementById('time').setAttribute('min', dayjs(1711130572022).format("YYYY-MM-DDTHH:mm"))
document.getElementById('time').setAttribute('max', dayjs(1711918541299).format("YYYY-MM-DDTHH:mm"))
document.getElementById('time').value = dayjs(1711879200000).format("YYYY-MM-DDTHH:mm");

var loop;
const reload = ()=>{
    document.getElementById('reload').textContent = "Chargement..."
    fetch(`/api/v1/getPixels?time=${new Date(document.getElementById('time').value).getTime()}`).then(resp=>resp.json()).then(resp=>{
        if (resp) {
            if (!resp.error) {
                if (resp.length > 0) {
                    drawGrille(resp);
                }         
            }
            else if (resp.text){
                alert(resp.text)
            }
        }
        let dateFin = dayjs().add(3, 's');
        loop = setInterval(()=>{
            if (dateFin.diff(dayjs()) > 0) {
                document.getElementById('reload').setAttribute('disabled', 'true')
                document.getElementById('reload').classList.add("disabled")
                document.getElementById('reload').textContent = dayjs(dateFin.diff(dayjs())).format("s");    
            }
            else {
                document.getElementById('reload').textContent = "Actualiser";
                document.getElementById('reload').removeAttribute('disabled')
                document.getElementById('reload').classList.remove("disabled")
                clearInterval(loop);
            }
        })
    })
}
document.getElementById('reload').addEventListener('click', reload);

reload();