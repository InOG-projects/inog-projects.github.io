# frozen_string_literal: true

# Some documents/ filenames contain umlauts (e.g. "InÖG", "Prüfsteine"). If the
# shell has no UTF-8 locale set, Ruby reads those filenames as ASCII-8BIT and
# Jekyll's URL escaping dies with:
#   `String#encode': "\xC3" from ASCII-8BIT to UTF-8 (Encoding::UndefinedConversionError)
# CI's Ubuntu runners happen to default to UTF-8, but a bare shell on macOS does
# not, so pin it here — the Gemfile is loaded by every `bundle exec` invocation.
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

source "https://rubygems.org"
# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem "jekyll", "~> 4"

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins
# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-redirect-from"
  gem "jekyll-sitemap"
end

gem "html-proofer"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
# Leaving this in here just in case somebody needs to run / work on this in Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
