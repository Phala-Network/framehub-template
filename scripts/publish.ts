// Call Thirdweb upload command to deploy compiled frame
import { spawn } from 'child_process'

try {
  const command = 'npx thirdweb upload dist/index.js'
  const childProcess = spawn(command, { shell: true })

  childProcess.stdout.on('data', (data) => {
    process.stdout.write(data)
  })

  let stderr = ''
  childProcess.stderr.on('data', (data) => {
    process.stderr.write(data)
    stderr += data
  })

  childProcess.on('close', (code) => {
    if (code === 0) {
      const regex = /ipfs:\/\/([a-zA-Z0-9]+)/;
      const match = stderr.match(regex);

      if (match) {
        const ipfsCid = match[1];
        console.log(`\nFrame deployed at: https://frames.phatfn.xyz/ipfs/${ipfsCid}`)
        console.log(`Simulate with Frames.js debugger: https://debugger.framesjs.org/debug?url=https://frames.phatfn.xyz/ipfs/${ipfsCid}`)
      } else {
        console.log('IPFS CID not found');
      }
    } else {
      console.log(`Command exited with code ${code}`)
    }
  });
} catch (error) {
  console.error('Error:', error)
}