# README

## Build & test locally

`bundle exec jekyll serve --host localhost --port 4000 --open-url`

## Link Testing

`bundle exec htmlproofer --assume_extension '.html' ./_site --ignore-urls "/^http://127.0.0.1/,/^http://0.0.0.0/,/^http://localhost/" --disable-external`

## Rubocop

`bundle exec rubocop`

## Prettier

Run it on the entire project

`prettier --write .`
