#!/bin/bash

# Configuration
FILES_PER_COMMIT=2        # Number of files per commit
DELAY_SECONDS=60          # Pause between commits (in seconds)

# Collect all untracked and modified files
mapfile -t files < <(git status --porcelain | awk '{print $2}')

total_files=${#files[@]}
if [ "$total_files" -eq 0 ]; then
  echo "No changes to commit."
  exit 0
fi

echo "Found $total_files files. Starting chunked commits..."

count=0
batch=()

for file in "${files[@]}"; do
  batch+=("$file")
  ((count++))

  # When the batch size is reached or on the last file
  if [ "${#batch[@]}" -ge "$FILES_PER_COMMIT" ] || [ "$count" -eq "$total_files" ]; then
    git add "${batch[@]}"
    git commit -m "Update: ${batch[*]}"
    echo "Committed batch of ${#batch[@]} file(s). Progress: $count/$total_files"
    
    batch=()

    # Sleep only if more files remain
    if [ "$count" -lt "$total_files" ]; then
      echo "Waiting $DELAY_SECONDS seconds before next commit..."
      sleep "$DELAY_SECONDS"
    fi
  fi
done

echo "All files committed successfully."