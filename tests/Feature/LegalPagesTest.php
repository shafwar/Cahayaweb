<?php

it('serves privacy policy and terms pages', function () {
    $this->get('/privacy-policy')->assertOk()->assertInertia(fn ($page) => $page->component('b2c/privacy-policy'));
    $this->get('/terms-of-service')->assertOk()->assertInertia(fn ($page) => $page->component('b2c/terms-of-service'));
});
