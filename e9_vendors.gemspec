# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "e9_vendors/version"

Gem::Specification.new do |s|
  s.name        = "e9_vendors"
  s.version     = E9Vendors::VERSION
  s.authors     = ["Travis Cox"]
  s.email       = ["numbers1311407@gmail.com"]
  s.homepage    = "http://github.com/e9digital/e9_vendors"
  s.summary     = %q{Vendor directory with widget}
  s.description = File.open('README.markdown').read rescue nil

  s.rubyforge_project = "e9_vendors"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
