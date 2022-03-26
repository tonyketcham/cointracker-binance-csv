# Convert BAT received from Brave in Uphold to Cointracker format

Usage

1. Clone the repo
1. Install dependencies with `pnpm install`
1. Add your `csv` file to the directory as `input.csv`.
1. Run the script

   ```sh
   node ./index.js
   ```

1. The output will be in `output.csv`

⚠️ This script has not been thoroughly tested and is limited in scope to **my specific use-case** where the _only_ transactions in my Uphold wallet were received BAT from Brave. You'll need to modify this to support additional use-cases - no warranties or guaranties are provided by using this script so proceed at your own risk!
